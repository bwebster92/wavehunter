# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

import os
import logging
import psycopg2
import requests
import json

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

        # Write scrape status directly here

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
        # Update db directly with spider status
        payload = {
            'scrape_id': spider.payload['scrape_id'],
            'scrape_params': json.dumps(spider.payload['scrape_params']),
            'completed': True
        }
        requests.put('http://finder-svc:3000/api/scrape',
                     json=payload)

        # Close db connection
        self.cur.close()
        self.connection.close()

        logging.debug('Crawl complete.')
