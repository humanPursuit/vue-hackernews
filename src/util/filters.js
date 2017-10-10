// const urlParser = document.createElement('a');

// export function domain(url) {
//     urlParser.href = url;
//     return urlParser.hostname;
// }

// compatible for ssr, no global DOM ? 
export function host(url) {
    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const parts = host.split('.').splice(-3);
    if (parts[0] === 'www') parts.shift();
    return parts.join('.');
}

export function timeAgo(time) {
    const diff = Date.now() / 1000 - Number(time);
    if (diff < 3600) {
        return pluralize(~~(diff / 60), 'minute');
    } else if (diff < 3600 * 24) {
        return pluralize(~~(diff / 3600), 'hour');
    } else {
        return pluralize(~~(diff / 3600 / 24), 'day');
    }
}

/**
 * pluralize labels for text
 * @param {Number} time 
 * @param {String} label 
 * @returns 
 */
function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    } else {
        return time + label + 's';
    }
}