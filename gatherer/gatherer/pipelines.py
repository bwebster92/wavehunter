# https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import os
import logging
import pandas as pd
from datetime import datetime, timezone
import psycopg
from psycopg.types.json import Jsonb
from io import StringIO

# Load db conn parameters from env vars
PGHOST = os.environ['PGHOST']
PGUSER = os.environ['PGUSER']
PGPASSWORD = os.environ['PGPASSWORD']
PGDATABASE = os.environ['PGDATABASE']


class GathererPipeline:

    def open_spider(self, spider):
        logging.debug('Connecting to db...')
        try:
            self.connection = psycopg.connect(
                host=PGHOST,
                user=PGUSER,
                password=PGPASSWORD,
                dbname=PGDATABASE
            )
            self.cur = self.connection.cursor()
        except (Exception, psycopg.DatabaseError) as error:
            logging.debug("Error: %s" % error)
            self.connection.rollback()
            return 1

        # Record scrape details in db
        logging.debug('Writing scrape metadata to db...')
        try:
            self.cur.execute(
                """
                INSERT INTO scrape(
                scrape_id, scrape_params, spider_name,
                completed, start_time
                )
                VALUES (%s, %s, %s, false, %s)
                """,
                (
                    spider.payload['scrape_id'],
                    Jsonb(spider.payload['scrape_params']),
                    spider.name, datetime.now(timezone.utc)
                ),
            )
            self.connection.commit()
        except (Exception, psycopg.DatabaseError) as error:
            logging.debug("Error: %s" % error)
            self.connection.rollback()
            return 1

        # Initalise items container
        self.item_list = []

    def process_item(self, item, spider):
        self.item_list.append(item)
        return item

    def close_spider(self, spider):
        logging.debug('Writing scraped items to db...')
        # Collect items in df
        items_df = pd.DataFrame(
            self.item_list, columns=self.item_list[0].keys())
        items_table = spider.name.replace('sf-', '')

        # Write df to buffer
        buffer = StringIO()
        items_df.to_csv(buffer, sep=';', index=False, header=True)
        buffer.seek(0)

        try:
            # Copy from buffer to db
            with buffer as f:
                with self.cur.copy(
                    psycopg.sql.SQL("""
                    COPY {} FROM STDIN (FORMAT csv, DELIMITER ';', HEADER true)
                    """).format(psycopg.sql.Identifier(items_table))
                ) as copy:
                    copy.write(f.read())

            # Update spider status in db
            logging.debug('Updating spider metadata...')
            self.cur.execute(
                """
                UPDATE scrape
                SET completed = true,
                    end_time = (%s)
                WHERE scrape_id = (%s)
                """,
                (
                    datetime.now(timezone.utc),
                    spider.payload['scrape_id']
                )
            )
            # Commit changes
            self.connection.commit()
            logging.debug(
                'Successfully wrote metadata and scraped items to db.')

        except (Exception, psycopg.DatabaseError) as error:
            logging.debug("Error: %s" % error)
            self.connection.rollback()
            return 1

        # Close db connection
        self.cur.close()
        self.connection.close()

        logging.debug('Crawl complete.')
