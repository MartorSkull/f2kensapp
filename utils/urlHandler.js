'use strict';

export default function url2dict(url){
    var data = url.split('?')[1].split('&');
    var dict = {};
    data.map((that) => {
        var both = that.split('=');
        dict[both[0]] = both[1];
    });
    return dict;
}

export function dict2url(dict){
    var url= "";
    for (var key in dict) {
        url += key+"="+dict[key]+"&";
    }
    return url.substring(0, url.length - 1);
}
