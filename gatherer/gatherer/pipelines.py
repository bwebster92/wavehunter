# https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import os
import logging
import psycopg2
from datetime import datetime, timezone, timedelta

from psycopg2.extras import Json
from psycopg2.extensions import register_adapter
register_adapter(dict, Json)

# Load db conn parameters from env vars
PGHOST = os.environ['PGHOST']
PGUSER = os.environ['PGUSER']
PGPASSWORD = os.environ['PGPASSWORD']
PGDATABASE = os.environ['PGDATABASE']


class GathererPipeline:
    def open_spider(self, spider):
        logging.debug('Connecting to db...')
        try:
            self.connection = psycopg2.connect(
                host=PGHOST,
                user=PGUSER,
                password=PGPASSWORD,
                dbname=PGDATABASE
            )
            self.cur = self.connection.cursor()
        except:
            logging.debug('Db connection error.')

        # Record scrape details in db
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
                Json(spider.payload['scrape_params']),
                spider.name, datetime.now(timezone.utc)
            ),
        )
        self.connection.commit()

    def process_item(self, item, spider):
        try:
            logging.debug('Writing item to db...')

            if spider.name == 'sf-forecast':
                self.cur.execute(
                    """
                    INSERT INTO forecast(
                        last_updated, break_id, forecast_time, swell_info,
                        wind_speed, wind_direction, wind_state
                        )
                    VALUES(%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (item['last_updated'], item['break_id'], item['forecast_time'],
                     item['swell_info'], item['wind_speed'], item['wind_direction'],
                     item['wind_state'])
                )
                self.connection.commit()

            if spider.name == 'sf-breaks':
                self.cur.execute(
                    """
                    INSERT INTO breaks(
                        region, break_id
                        )
                    VALUES(%s,%s)
                    """,
                    (item['region'], item['break_id'])
                )
                self.connection.commit()

            logging.debug('Db write success.')
        except:
            logging.debug('Db write error.')
        finally:
            return item

    def close_spider(self, spider):
        # Update spider status in db
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
        self.connection.commit()

        # Close db connection
        self.cur.close()
        self.connection.close()

        logging.debug('Crawl complete.')
