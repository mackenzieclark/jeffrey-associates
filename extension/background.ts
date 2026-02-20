var browser: Browser = browser || chrome;

const MIGRATION = ':MIGRATION'

const CURRENT_VERSION = 100037;

const BUNDLED_BLOOM_FILTER_VERSION = 26020100
const badIdentifiersReasons: { [id: string]: BadIdentifierReason } = {};
const badIdentifiers: { [id: string]: true } = {};

interface BloomFilters {
    associate: CombinedBloomFilter;
    bloomVersion: number;
}

// If a user labels one of these URLs, they're making a mistake. Ignore the label.
// This list includes:
// * Social networks that are not supported (SN)
// * System pages of supported social networks
// * Archival and link shortening sites. (AR)
// * Reddit bots.
const badIdentifiersArray = [
    'a.co',
    'about.me=SN',
    'allmylinks.com=SN',
    'amzn.to',
    'archive.is=AR',
    'archive.org=AR',
    'archiveofourown.org=SN',
    'ask.fm=SN',
    'assets.tumblr.com',
    'beacons.ai=SN',
    'bing.com',
    'bit.ly',
    'blogspot.com',
    'buymeacoffee.com=SN',
    'cash.app=SN',
    'cash.me=SN',
    'change.org',
    'chrome.google.com',
    'cohost.org',
    'cohost.org/rc',
    'counter.social=SN',
    'curiouscat.live=SN',
    'curiouscat.me=SN',
    'curiouscat.qa=SN',
    'curiositystream.com=SN',
    'deviantart.com=SN',
    'discord.gg=SN',
    'discordapp.com=SN',
    'discord-store.com=SN',
    'disqus.com',
    'docs.google.com',
    'drive.google.com',
    'duckduckgo.com',
    'en.wikipedia.org',
    'en.wikiquote.org',
    'etsy.com=SN',
    'facebook.com',
    'facebook.com/a',
    'facebook.com/about',
    'facebook.com/ad_campaign',
    'facebook.com/ads',
    'facebook.com/advertising',
    'facebook.com/ajax',
    'facebook.com/bookmarks',
    'facebook.com/browse',
    'facebook.com/buddylist.php',
    'facebook.com/bugnub',
    'facebook.com/business',
    'facebook.com/c',
    'facebook.com/comment',
    'facebook.com/composer',
    'facebook.com/connect',
    'facebook.com/dialog',
    'facebook.com/docs',
    'facebook.com/donate',
    'facebook.com/events',
    'facebook.com/findfriends',
    'facebook.com/friends',
    'facebook.com/fundraisers',
    'facebook.com/games',
    'facebook.com/groups',
    'facebook.com/hashtag',
    'facebook.com/help',
    'facebook.com/home.php',
    'facebook.com/instantgames',
    'facebook.com/intl',
    'facebook.com/jobs',
    'facebook.com/l.php',
    'facebook.com/language.php',
    'facebook.com/latest',
    'facebook.com/legal',
    'facebook.com/like.php',
    'facebook.com/local_surface',
    'facebook.com/logout.php',
    'facebook.com/marketplace',
    'facebook.com/mbasic',
    'facebook.com/me',
    'facebook.com/media',
    'facebook.com/memories',
    'facebook.com/menu',
    'facebook.com/messages',
    'facebook.com/nfx',
    'facebook.com/notes',
    'facebook.com/notifications',
    'facebook.com/notifications.php',
    'facebook.com/nt',
    'facebook.com/page',
    'facebook.com/pages',
    'facebook.com/people',
    'facebook.com/permalink.php',
    'facebook.com/pg',
    'facebook.com/photo',
    'facebook.com/photo.php',
    'facebook.com/places',
    'facebook.com/policies',
    'facebook.com/privacy',
    'facebook.com/profile',
    'facebook.com/profile.php',
    'facebook.com/public',
    'facebook.com/rapid_report',
    'facebook.com/reactions',
    'facebook.com/salegroups',
    'facebook.com/search',
    'facebook.com/settings',
    'facebook.com/share',
    'facebook.com/share.php',
    'facebook.com/sharer.php',
    'facebook.com/shares',
    'facebook.com/stories',
    'facebook.com/story.php',
    'facebook.com/support',
    'facebook.com/timeline',
    'facebook.com/ufi',
    'facebook.com/video',
    'facebook.com/watch',
    'fb.me',
    'flickr.com=SN',
    'furaffinity.net=SN',
    'gofundme.com=SN',
    'goo.gl',
    'google.com',
    'googleusercontent.com',
    'handle.invalid',
    'hivesocial.app=SN',
    'http',
    'https',
    'i.imgur.com',
    'i.reddituploads.com',
    'imdb.com=SN',
    'imgur.com',
    'indiegogo.com=SN',
    'instagram.com=SN',
    'itunes.apple.com=SN',
    'ko-fi.com=SN',
    'last.fm=SN',
    'linkedin.com=SN',
    'linktr.ee=SN',
    'mail.google.com',
    'media.tumblr.com',
    'at.tumblr.com',
    'medium.com',
    'nebula.app=SN',
    'nebula.tv=SN',
    'news.google.com',
    'onlyfans.com=SN',
    'open.spotify.com=SN',
    'patreon.com=SN',
    'paypal.com=SN',
    'paypal.me=SN',
    'post.news=SN',
    'pillowfort.social=SN',
    'pinterest.com=SN',
    'pixiv.net',
    'play.google.com',
    'plus.google.com=SN',
    'podcasts.apple.com=SN',
    'poshmark.com=SN',
    'rationalwiki.org',
    'reddit.com',
    'reddit.com/r/all',
    'reddit.com/r/popular',
    'reddit.com/user/_youtubot_',
    'reddit.com/user/animalfactsbot',
    'reddit.com/user/anti-gif-bot',
    'reddit.com/user/areyoudeaf',
    'reddit.com/user/automoderator',
    'reddit.com/user/autotldr',
    'reddit.com/user/auto-xkcd37',
    'reddit.com/user/biglebowskibot',
    'reddit.com/user/bots_rise_up',
    'reddit.com/user/cheer_up_bot',
    'reddit.com/user/cheer-bot',
    'reddit.com/user/clickablelinkbot',
    'reddit.com/user/colorizethis',
    'reddit.com/user/darnit_bot',
    'reddit.com/user/darthplagueisbot',
    'reddit.com/user/deepfrybot',
    'reddit.com/user/dreamprocessor',
    'reddit.com/user/drunkanimalfactbot',
    'reddit.com/user/election_info_bot',
    'reddit.com/user/eyebleachbot',
    'reddit.com/user/factorial-bot',
    'reddit.com/user/friendly-bot',
    'reddit.com/user/garlicbot',
    'reddit.com/user/gfycat_details_fixer',
    'reddit.com/user/gifv-bot',
    'reddit.com/user/good_good_gb_bb',
    'reddit.com/user/goodbot_badbot',
    'reddit.com/user/goodmod_badmod',
    'reddit.com/user/gyazo_bot',
    'reddit.com/user/haikubot-1911',
    'reddit.com/user/haiku-detector',
    'reddit.com/user/helperbot_',
    'reddit.com/user/hug-bot',
    'reddit.com/user/i_am_a_haiku_bot',
    'reddit.com/user/ilinknsfwsubreddits',
    'reddit.com/user/image_linker_bot',
    'reddit.com/user/imdb_preview',
    'reddit.com/user/imguralbumbot',
    'reddit.com/user/jacksfilmsbot',
    'reddit.com/user/jiffierbot',
    'reddit.com/user/livetwitchclips',
    'reddit.com/user/lyrics-matcher-bot',
    'reddit.com/user/magic_eye_bot',
    'reddit.com/user/mailmygovnnbot',
    'reddit.com/user/massdropbot',
    'reddit.com/user/mentioned_videos',
    'reddit.com/user/metric_units',
    'reddit.com/user/mlbvideoconverterbot',
    'reddit.com/user/morejpeg_auto',
    'reddit.com/user/movieguide',
    'reddit.com/user/multiusebot',
    'reddit.com/user/news-summary',
    'reddit.com/user/nflvideoconverterbot',
    'reddit.com/user/octopusfunfacts',
    'reddit.com/user/octupusfunfacts',
    'reddit.com/user/opfeels',
    'reddit.com/user/payrespects-bot',
    'reddit.com/user/perrycohen',
    'reddit.com/user/phonebatterylevelbot',
    'reddit.com/user/picdescriptionbot',
    'reddit.com/user/portmanteau-bot',
    'reddit.com/user/quoteme-bot',
    'reddit.com/user/redditsilverbot',
    'reddit.com/user/redditstreamable',
    'reddit.com/user/remindmebot',
    'reddit.com/user/riskyclickerbot',
    'reddit.com/user/rosey-the-bot',
    'reddit.com/user/seriouslywhenishl3',
    'reddit.com/user/shhbot',
    'reddit.com/user/smallsubbot',
    'reddit.com/user/snapshillbot',
    'reddit.com/user/sneakpeekbot',
    'reddit.com/user/stabbot',
    'reddit.com/user/stabbot_crop',
    'reddit.com/user/steamnewsbot',
    'reddit.com/user/subjunctive__bot',
    'reddit.com/user/table_it_bot',
    'reddit.com/user/thehelperdroid',
    'reddit.com/user/the-paranoid-android',
    'reddit.com/user/thiscatmightcheeryou',
    'reddit.com/user/timestamp_bot',
    'reddit.com/user/timezone_bot',
    'reddit.com/user/tiny_smile_bot',
    'reddit.com/user/tipjarbot',
    'reddit.com/user/tippr',
    'reddit.com/user/totes_meta_bot',
    'reddit.com/user/totesmessenger',
    'reddit.com/user/tumblrdirect',
    'reddit.com/user/tweetsincommentsbot',
    'reddit.com/user/twitterlinkbot',
    'reddit.com/user/twittertostreamable',
    'reddit.com/user/video_descriptionbot',
    'reddit.com/user/videodirectlinkbot',
    'reddit.com/user/vredditmirrorbot',
    'reddit.com/user/whodidthisbot',
    'reddit.com/user/wikitextbot',
    'reddit.com/user/xkcd_transcriber',
    'reddit.com/user/youtubefactsbot',
    'reddituploads.com',
    'removeddit.com',
    'sites.google.com',
    'snapchat.com=SN',
    'soundcloud.com=SN',
    'spotify.com=SN',
    'steamcommunity.com=SN',
    't.co',
    't.me=SN',
    't.umblr.com',
    'tapastic.com=SN',
    'tapatalk.com=SN',
    'tinyurl.com',
    'tiktok.com=SN',
    'tmblr.co',
    'tumblr.com',
    'communities.tumblr.com',
    'twitch.tv=SN',
    'x.com',
    'twitter.com',
    'twitter.com/explore',
    'twitter.com/hashtag',
    'twitter.com/home',
    'twitter.com/i',
    'twitter.com/intent',
    'twitter.com/messages',
    'twitter.com/notifications',
    'twitter.com/search',
    'twitter.com/settings',
    'twitter.com/share',
    'twitter.com/threader_app',
    'twitter.com/threadreaderapp',
    'twitter.com/who_to_follow',
    'vimeo.com=SN',
    'vk.com=SN',
    'vm.tiktok.com=SN',
    'wattpad.com=SN',
    'wikipedia.org',
    'wordpress.com',
    'wp.me',
    'www.tumblr.com',
    'youtu.be',
    'youtube.com',
    'youtube.com/account',
    'youtube.com/embed',
    'youtube.com/feed',
    'youtube.com/gaming',
    'youtube.com/playlist',
    'youtube.com/shorts',
    'youtube.com/premium',
    'youtube.com/redirect',
    'youtube.com/watch',
    'anarchism.space',
    'aus.social',
    'c.im',
    'chaos.social',
    'eightpoint.app',
    'eldritch.cafe',
    'fosstodon.org',
    'hachyderm.io',
    'infosec.exchange',
    'kolektiva.social',
    'mas.to',
    'masto.ai',
    'mastodon.art',
    'mastodon.cloud',
    'mastodon.green',
    'mastodon.ie',
    'mastodon.lol',
    'mastodon.nz',
    'mastodon.online',
    'mastodon.scot',
    'mastodon.social',
    'mastodon.world',
    'mastodon.xyz',
    'mastodonapp.uk',
    'meow.social',
    'mstdn.ca',
    'mstdn.jp',
    'mstdn.social',
    'octodon.social',
    'ohai.social',
    'pixelfed.social',
    'queer.party',
    'sfba.social',
    'social.transsafety.network',
    'tech.lgbt',
    'techhub.social',
    'toot.cat',
    'toot.community',
    'toot.wales',
    'vulpine.club',
    'wandering.shop',

    'threads.net',
    'bsky.social=SN',
    'bsky.app=SN'
].map(x => {
    const arr = x.split('=');
    const id = arr[0];
    if (arr[1]) badIdentifiersReasons[id] = <BadIdentifierReason>arr[1];
    badIdentifiers[id] = true;
    return id;
});


var overrides: LabelMap = null;
var installationId: string = null;
var theme: string = '';
var cacheStorage: Cache;


function writeLocalStorage(v: any): Promise<void> {
    return new Promise(resolve => browser.storage.local.set(v, resolve));
}

function readLocalStorage(keys: string[]) : Promise<any> {
    return new Promise(resolve => {
        browser.storage.local.get(keys, v => resolve(v));
    });
}

var initializationPromise = (async () => {
    var v = await readLocalStorage(['overrides', 'installationId', 'theme', 'disableDynamicUpdates', 'dynamicBloomLastUpdate']);
    if (!v.installationId) {
        installationId = crypto.randomUUID();
        browser.storage.local.set({ installationId: installationId });
    } else {
        installationId = v.installationId;
    }

    overrides = v.overrides || {}
    theme = v.theme;

    const migration = +(overrides[MIGRATION] || 0);
    if (migration < CURRENT_VERSION) {

        for (const key of Object.getOwnPropertyNames(overrides)) {
            if (key.startsWith(':')) continue;
            if (key.startsWith('facebook.com/a.')) {
                delete overrides[key];
                continue;
            }
            if (key != key.toLowerCase()) {
                let v = overrides[key];
                delete overrides[key];
                overrides[key.toLowerCase()] = v;
            }
        }

        badIdentifiersArray.forEach(x => delete overrides[x]);

        overrides[MIGRATION] = <any>CURRENT_VERSION;
        browser.storage.local.set({ overrides: overrides });
    }

    if (!v.disableDynamicUpdates) {
        try {
            cacheStorage = await caches.open('v1');
            await loadDynamicBloomFilters(true);
        } catch (e) {
            console.warn('Could not load dynamic filters:')
            console.warn(e);
        }
    }

    if (!bloomFilters) {
        bloomFilters = {
            associate: await loadBloomFilterBundled('associate'),
            bloomVersion: BUNDLED_BLOOM_FILTER_VERSION
        };
        console.log('Loaded bundled bloom filters.')
    }

    if (!v.disableDynamicUpdates) {
        const now = Date.now();
        const dynamicBloomLastUpdate = <number>v.dynamicBloomLastUpdate;
        const UPDATE_INTERVAL_MS = 4 * 3600 * 1000;
        var initialDelay = !dynamicBloomLastUpdate || dynamicBloomLastUpdate > now ? 0 : Math.max(0, dynamicBloomLastUpdate + UPDATE_INTERVAL_MS - now);

        console.log('Initial delay for update check: ' + initialDelay)
        setTimeout(() => {
            setInterval(checkBloomFilterUpdates, UPDATE_INTERVAL_MS);
            checkBloomFilterUpdates()
        }, Math.max(5000, initialDelay));

    }

})();

interface DynamicConfiguration {
    associate: string;
    bloomVersion: number;
    acceptDowngrades: boolean;
}


async function checkBloomFilterUpdates() {
    try {
        console.log('Checking for updates...')
        const now = Date.now();

        await writeLocalStorage({ dynamicBloomLastUpdate: now });

        const response = await fetch('https://raw.githubusercontent.com/jeffrey-associates/configuration/main/configuration.json' + '?random=' + Math.random(), {cache: "no-cache"})
        if (response.status != 200) throw ('HTTP status ' + response.status);
        const config = <DynamicConfiguration>await response.json();
        if (!config.bloomVersion) throw 'Missing bloomVersion';

        if (!config.acceptDowngrades) {
            if (config.bloomVersion < bloomFilters.bloomVersion) {
                console.log('Ignoring version downgrade')
                return;
            }
        }
        const dynamicBloomAssociateURL = config.associate.replace('%VERSION%', config.bloomVersion.toString());
        await writeLocalStorage({ dynamicBloomAssociateURL, dynamicBloomVersion: config.bloomVersion });

        console.log('Successfully checked for updates: ' + config.bloomVersion);

        await loadDynamicBloomFilters(false);
    } catch (e) {
        console.warn('checkBloomFilterUpdates failed:');
        console.warn(e);
    }
}

async function getCached(cache: Cache, url: string, onlyIfPrecached: boolean) : Promise<Response | null> {
    const existing = await cache.match(url);
    if (existing) {
        console.log('Already cached: ' + url);
        return existing;
    }
    if (onlyIfPrecached) {
        console.log('Not precached, aborting: ' + url)
        return null;
    }
    await cache.add(url);
    const response = await cache.match(url);
    console.log('Fetched: ' + url);
    return response;
}

async function loadDynamicBloomFilters(onlyIfPrecached: boolean) : Promise<void> {
    const info = await readLocalStorage(['dynamicBloomAssociateURL', 'dynamicBloomVersion']);
    if (!info.dynamicBloomAssociateURL || !info.dynamicBloomVersion) return;

    if (bloomFilters && bloomFilters.bloomVersion == info.dynamicBloomVersion) {
        console.log('Bloom filters already loaded at version ' + bloomFilters.bloomVersion);
        return;
    }

    const associateResponse = await getCached(cacheStorage, info.dynamicBloomAssociateURL, onlyIfPrecached);
    if (!associateResponse) return;

    bloomFilters = <BloomFilters>{
        associate: await loadBloomFilterFromResponse('associate', associateResponse, 287552),
        bloomVersion: info.dynamicBloomVersion
    };
    console.log('Loaded dynamic filters at version: ' + bloomFilters.bloomVersion);
}

let bloomFilters: BloomFilters = null;


async function loadBloomFilterBundled(name: string): Promise<CombinedBloomFilter> {
    const url = getURL('data/' + name + '.dat');
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return loadBloomFilterFromBuffer(name, arrayBuffer)
}

async function loadBloomFilterFromResponse(name: string, response: Response, expectedSize: number): Promise<CombinedBloomFilter> {
    var arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength != expectedSize) throw 'Mismatching bloom filter size.'
    return await loadBloomFilterFromBuffer(name, arrayBuffer);
}

function loadBloomFilterFromBuffer(name: string, data: ArrayBuffer) : CombinedBloomFilter {
    const combined = new CombinedBloomFilter();
    combined.name = name;
    combined.parts = [
        new BloomFilter(new Int32Array(data), 20),
    ];
    return combined;
}


async function handleMessage(message: JeffreyAssociatesMessage, sender: MessageSender) : Promise<LabelMap> {
    if (message.setTheme) {
        theme = message.setTheme;
        browser.storage.local.set({ theme: message.setTheme });
        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; ++i) {
                try {
                    sendMessageToContent(tabs[i].id, null, { updateAllLabels: true });
                } catch (e) { }
            }
        });
    }
    if (message.closeCallingTab) {
        browser.tabs.remove(sender.tab.id);
        return {};
    }
    const response: LabelMap = {};
    await initializationPromise;
    const associateBloomFilter = bloomFilters.associate;
    for (const id of message.ids) {
        if (overrides[id] !== undefined) {
            response[id] = overrides[id];
            continue;
        }
        const isAssociate = testBloomFilter(associateBloomFilter, id);
        if (isAssociate) response[id] = 'associate';
    }
    response[':theme'] = <any>theme;
    return response;
}

function testBloomFilter(bloomFilter: CombinedBloomFilter, id: string) {
    if (bloomFilter.test(id)) return true;
    if (id.startsWith('youtube.com/@') && bloomFilter.test(id.replace('/@', '/c/'))) return true;
    return false;
}

browser.runtime.onMessage.addListener<JeffreyAssociatesMessage, JeffreyAssociatesMessage | LabelMap>((message, sender, sendResponse) => {
    handleMessage(message, sender).then(response => sendResponse(response));
    return true;
});


const socialNetworkPatterns = [
    "*://*.facebook.com/*",
    "*://*.youtube.com/*",
    "*://*.reddit.com/*",
    "*://*.twitter.com/*",
    "*://*.x.com/*",
    "*://*.t.co/*",
    "*://*.bsky.app/*",
    "*://*.bsky.social/*",
    "*://*.medium.com/*",
    "*://disqus.com/*",
    "*://*.tumblr.com/*",
    "*://*.wikipedia.org/*",
    "*://*.rationalwiki.org/*",
    "*://*.google.com/*",
    "*://*.bing.com/*",
    "*://duckduckgo.com/*",
    "*://cohost.org/*",

    "*://*/@*",
    "*://*/users/*",
];

const homepagePatterns = [
            "*://*/",
            "*://*/?fbclid=*",
            "*://*/about*",
            "*://*/contact*",
            "*://*/faq*",
            "*://*/blog",
            "*://*/blog/",
            "*://*/news",
            "*://*/news/",
            "*://*/en/",
            "*://*/index.html",
            "*://*/index.php",
];

const allPatterns = socialNetworkPatterns.concat(homepagePatterns);


function createSystemContextMenu(text: string, id: ContextMenuCommand, separator?: boolean) {
    browser.contextMenus.create({
        id: id,
        title: text,
        contexts: ["all"],
        type: separator ? 'separator' : 'normal',
        documentUrlPatterns: allPatterns
    });
}

createSystemContextMenu('---', 'separator', true);
createSystemContextMenu('Settings', 'options');
createSystemContextMenu('Help', 'help');


function openHelp() {
    browser.tabs.create({
        url: getURL('help.html')
    })
}


function openOptions() {
    browser.tabs.create({
        url: getURL('options.html')
    })
}

function getURL(path: string) {
    return browser.extension.getURL(path);
}


function sendMessageToContent(tabId: number, frameId: number, message: JeffreyAssociatesCommand) {
    const options = frameId === null ? undefined : { frameId: frameId };
    console.log(message);
    browser.tabs.sendMessage<JeffreyAssociatesCommand, void>(tabId, message, options);
}

browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == 'help') {
        openHelp();
        return;
    }
    if (info.menuItemId == 'options') {
        openOptions();
        return;
    }
});
