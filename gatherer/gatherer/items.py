# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from w3lib.html import remove_tags
from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst


class Breaks(scrapy.Item):
    region = scrapy.Field()
    break_id = scrapy.Field()


class BreaksLoader(ItemLoader):
    default_item_class = Breaks
    default_output_processor = TakeFirst()


class Forecast(scrapy.Item):
    last_updated = scrapy.Field()
    break_id = scrapy.Field()
    forecast_time = scrapy.Field()
    swell_info = scrapy.Field()
    wind_speed = scrapy.Field()
    wind_direction = scrapy.Field()
    wind_state = scrapy.Field()


class ForecastLoader(ItemLoader):
    default_item_class = Forecast
    default_output_processor = TakeFirst()

    wind_state_in = MapCompose(remove_tags)
