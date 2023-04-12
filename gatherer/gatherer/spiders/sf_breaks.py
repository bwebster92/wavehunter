import scrapy

from gatherer.items import BreaksLoader


class SfBreaksSpider(scrapy.Spider):
    name = 'sf-breaks'
    allowed_domains = ['surf-forecast.com']
    start_urls = ['https://www.surf-forecast.com/provinces/Tasmania/breaks']

    def parse(self, response):
        break_list = response.xpath("//table[@class='list_table']//tr")
        for entry in break_list:
            region = entry.xpath(".//td/h2/a/@href").get()
            break_id = entry.xpath(".//td/a/@href").getall()

            if region:
                current_region = region
            else:
                for id in break_id:
                    l = BreaksLoader()
                    l.add_value('break_id', id)
                    l.add_value('region', current_region)
                    yield l.load_item()
