/*
 * Copyright © 2017–2020 Daniel Aleksandersen <https://www.daniel.priv.no/>
 * Copyright © 2020 omicron-b <https://github.com/omicron-b/>
 * SPDX-License-Identifier: MIT
 * License-Filename: LICENSE
 */

// Yandex Turbo redirect
// Convert https://yandex.ru/turbo/s/example.com/document
//      to https://example.com/document

var browserapp = (typeof browser !== 'undefined') ? browser : chrome;

// Redirect most links where target path is a part of source path
function turbo_redirector(requestDetails)
{
  var turbo = new URL(requestDetails.url);
  var redirection = turbo.pathname.replace(/^\/turbo\/s\//, 'https://')
                                  .replace(/^\/turbo\//, 'https://')
                                  .replace(/\/s\//, '\/')
                                  .replace(/^\//, 'https://');

  return {
    redirectUrl: redirection
  };
}

browserapp.webRequest.onBeforeRequest.addListener(
  turbo_redirector,
  {
    urls: [
      'https://yandex.ru/turbo/*',
      'https://*.turbopages.org/*'
    ]
  },
  ["blocking"]
);

// Redirect links there target path is a 'text' parameter
function toRedirect(requestDetails)
{
  var currentURL = requestDetails.url;
  var redirectTo = decodeURIComponent(currentURL.replace("https://yandex.ru/turbo?text=",""));
  return { redirectUrl: redirectTo };
}

browserapp.webRequest.onBeforeRequest.addListener(
  toRedirect,
  {
    urls: [
      'https://yandex.ru/turbo?text=*'
    ]
  },
  ["blocking"]
);

