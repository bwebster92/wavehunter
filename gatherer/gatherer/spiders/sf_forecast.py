import scrapy
from scrapy_splash import SplashRequest
from datetime import datetime

from gatherer.items import ForecastLoader


class SfForecastSpider(scrapy.Spider):
    name = 'sf-forecast'
    allowed_domains = ['surf-forecast.com']

    def start_requests(self):
        break_list = self.payload['scrape_params']['break_id']
        timestamp = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")

        for break_id in break_list:
            yield SplashRequest(
                url=f"https://www.surf-forecast.com/breaks/{break_id}/forecasts/latest",
                callback=self.parse_break,
                meta={
                    'last_updated': timestamp,
                    'break_id': break_id
                }
            )

    def parse_break(self, response):
        forecast_table = response.xpath(
            '//table[contains(@class, "js-forecast-table-content")]')

        swell_data = forecast_table.xpath(
            './/td[contains(@class, "wave-height")]')
        wind_data = forecast_table.xpath(
            './/td[contains(@class, "wind__cell")]')
        wind_quality = forecast_table.xpath(
            './/td[contains(@class, "wind-state")]').getall()

        for i in range(len(swell_data)):
            l = ForecastLoader()

            l.add_value('last_updated', response.request.meta['last_updated'])
            l.add_value('break_id', response.request.meta['break_id'])
            l.add_value('forecast_time', swell_data[i].xpath(
                './/@data-date').get())
            l.add_value('swell_info', swell_data[i].xpath(
                './/@data-swell-state').get())
            l.add_value('wind_speed', wind_data[i].xpath(
                './/@data-speed').get())
            l.add_value('wind_direction', wind_data[i].xpath(
                './/div[@class="wind-icon__letters"]/text()').get())
            l.add_value('wind_state', wind_quality[i])

            yield l.load_item()
