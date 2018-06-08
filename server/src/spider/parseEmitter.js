import EventEmitter from 'events'
import $ from 'cheerio'

const parseEmitter = new EventEmitter();

export const ParseEvents = {
    PARSE_TYPE: 'PARSE_TYPE',
    PARSE_OFFICIAWEBSITE: 'PARSE_OFFICIAWEBSITE',
    PARSE_COUNTRIES: 'PARSE_COUNTRIES',
    PARSE_LANGUSGES: 'PARSE_LANGUSGES',
    PARSE_PUBDATES: 'PARSE_PUBDATES',
    PARSE_SEASON: 'PAESE_SEASON',
    PARSE_COUNT: 'PAESE_COUNT',
    PARSE_DURATIONS: 'PAESE_DURATIONS',
    PARSE_AKA: 'PAESE_AKA',
    PARSE_IMDBLINK: 'PAESE_IMDBLINK'
}

parseEmitter.on(ParseEvents.PARSE_AKA, (detail, doubanDetaiDocument, currentItem) => {
    detail.aka = currentItem.next.data.trim().split('/').map((item) => {return item.trim();});
})

parseEmitter.on(ParseEvents.PARSE_COUNT, (detail, doubanDetaiDocument, currentItem) => {
    detail.count = currentItem.next.data.trim();
})

parseEmitter.on(ParseEvents.PARSE_DURATIONS, (detail, doubanDetaiDocument, currentItem) => {
    detail.durations = doubanDetaiDocument('#info').children('span[property="v:runtime"]').text();
})

parseEmitter.on(ParseEvents.PARSE_IMDBLINK, (detail, doubanDetaiDocument, currentItem) => {
    detail.IMBdLink = $(currentItem).next().attr('href');
})

parseEmitter.on(ParseEvents.PARSE_SEASON, (detail, doubanDetaiDocument, currentItem) => {
    detail.season = doubanDetaiDocument('#season').find('option:selected').text();
})

parseEmitter.on(ParseEvents.PARSE_COUNTRIES, (detail, doubanDetaiDocument, currentItem) => {
    detail.countries = currentItem.next.data.trim().split('/').map((item) => {return item.trim();});
})

parseEmitter.on(ParseEvents.PARSE_LANGUSGES, (detail, doubanDetaiDocument, currentItem) => {
    detail.languages = currentItem.next.data.trim().split('/').map((item) => {return item.trim();});
})

parseEmitter.on(ParseEvents.PARSE_OFFICIAWEBSITE, (detail, doubanDetaiDocument, currentItem) => {
    detail.officialWebsite = $(currentItem).next().attr('href');
})

parseEmitter.on(ParseEvents.PARSE_PUBDATES, (detail, doubanDetaiDocument, currentItem) => {
    const $releaseDate = doubanDetaiDocument('#info').children('span[property="v:initialReleaseDate"]');
    const releaseDateArray = [];
    $releaseDate.map((i, item) => {
        releaseDateArray.push($(item).text());
    });
    detail.pubdates = releaseDateArray;
})

parseEmitter.on(ParseEvents.PARSE_TYPE, (detail, doubanDetaiDocument, currentItem) => {
    const $type = doubanDetaiDocument('#info').children('span[property="v:genre"]');
    const typeArray = [];
    $type.map((i, item) => {
        typeArray.push($(item).text());
    });
    detail.types = typeArray;
})

export const ParseEmitter = parseEmitter;
