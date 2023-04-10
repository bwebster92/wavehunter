import os
import sys
import time
import logging
import psycopg2

from flask import Flask, request, session
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings

# Initialise crochet reactor and scrapy runner
from crochet import setup, run_in_reactor, retrieve_result, TimeoutError
setup()
runner = CrawlerRunner(get_project_settings())


# Load postgres conn parameters from env vars
PGHOST = os.environ['PGHOST']
PGUSER = os.environ['PGUSER']
PGPASSWORD = os.environ['PGPASSWORD']
PGDATABASE = os.environ['PGDATABASE']

retries = 5
for attempt in range(retries):
    try:
        connection = psycopg2.connect(
            host=PGHOST,
            user=PGUSER,
            password=PGPASSWORD,
            dbname=PGDATABASE
        )
        connection.close()
        break
    except:
        time.sleep(1)

# Define flask API
app = Flask(__name__)


@run_in_reactor
def init_spider(Spider, *args, **kwargs):
    return runner.crawl(Spider, *args, **kwargs)


@app.route('/scrape', methods=['POST'])
def scrape():
    # If no crawl exists, start one, pass it kwargs and stash it in session data
    if 'crawl' not in session:
        completed = init_spider(
            request.json['spider'], payload=request.json['scrape_payload'])
        session['crawl'] = completed.stash()
        return 'Starting crawl...'

    # Otherwise, grab the crawl and check it's finished
    completed = retrieve_result(session.pop('crawl'))
    try:
        # Return completed status
        crawl = completed.wait(0.1)
        return 'Crawl completed.'
    except TimeoutError:
        session['crawl'] = completed.stash()
        return 'Crawl in progress...'
    except:
        return 'Crawl failed:\n' + completed.original_failure().getTraceback()


if __name__ == '__main__':
    logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)
    app.secret_key = os.urandom(24)
    app.run(host='0.0.0.0', port=3000)
