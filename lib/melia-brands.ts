import { Brand, BrandAsset } from './types';

export const INITIAL_MELIA_BRANDS: Brand[] = [];
export const INITIAL_MELIA_ASSETS: BrandAsset[] = [];

INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_meliarewards', type: 'logo', name: 'MeliáRewards Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0ibm9ybWFsIiBsZXR0ZXItc3BhY2luZz0ibm9ybWFsIiBmaWxsPSIjMEExQzJBIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NZWxpw6FSZXdhcmRzPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_meliarewards',
        name: 'MeliáRewards',
        colors: ["#0A1C2A", "#D4AF37", "#FFFFFF"],
        logoIds: ['asset_logo_brand_meliarewards'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_granmelia', type: 'logo', name: 'Gran Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGV0dGVyLXNwYWNpbmc9Im5vcm1hbCIgZmlsbD0iIzAwMDAwMCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R3JhbiBNZWxpw6E8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_granmelia',
        name: 'Gran Meliá',
        colors: ["#000000", "#D4AF37", "#FFFFFF"],
        logoIds: ['asset_logo_brand_granmelia'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_me', type: 'logo', name: 'ME by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0iYm9sZCIgbGV0dGVyLXNwYWNpbmc9Im5vcm1hbCIgZmlsbD0iIzAwMDAwMCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TUUgYnkgTWVsacOhPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_me',
        name: 'ME by Meliá',
        colors: ["#000000", "#D81B60", "#FFFFFF"],
        logoIds: ['asset_logo_brand_me'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_paradisus', type: 'logo', name: 'Paradisus Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSI0MiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgbGV0dGVyLXNwYWNpbmc9Im5vcm1hbCIgZmlsbD0iIzAwNjk5NCIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGFyYWRpc3VzPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_paradisus',
        name: 'Paradisus',
        colors: ["#006994", "#EEDC9A", "#FFFFFF"],
        logoIds: ['asset_logo_brand_paradisus'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_melia', type: 'logo', name: 'Meliá Hotels & Resorts Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0ibm9ybWFsIiBsZXR0ZXItc3BhY2luZz0iMnB4IiBmaWxsPSIjMDAyQzVGIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NZWxpw6EgSG90ZWxzICYgUmVzb3J0czwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_melia',
        name: 'Meliá Hotels & Resorts',
        colors: ["#002C5F", "#FFFFFF"],
        logoIds: ['asset_logo_brand_melia'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_innside', type: 'logo', name: 'INNSiDE by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0iOTAwIiBsZXR0ZXItc3BhY2luZz0ibm9ybWFsIiBmaWxsPSIjMDAwMDAwIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JTk5TaURFIGJ5IE1lbGnDoTwvdGV4dD4KICAgIDwvc3ZnPg==' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_innside',
        name: 'INNSiDE by Meliá',
        colors: ["#FFC107", "#000000", "#FFFFFF"],
        logoIds: ['asset_logo_brand_innside'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_sol', type: 'logo', name: 'Sol by Meliá Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0ibm9ybWFsIiBsZXR0ZXItc3BhY2luZz0ibm9ybWFsIiBmaWxsPSIjMDBCQ0Q0IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Tb2wgYnkgTWVsacOhPC90ZXh0PgogICAgPC9zdmc+' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_sol',
        name: 'Sol by Meliá',
        colors: ["#00BCD4", "#FFEB3B", "#FFFFFF"],
        logoIds: ['asset_logo_brand_sol'],
        fontIds: {}
    });
INITIAL_MELIA_ASSETS.push({ id: 'asset_logo_brand_zel', type: 'logo', name: 'ZEL Logo Primary', mimeType: 'image/svg+xml', data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNDAwIDE1MCI+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idHJhbnNwYXJlbnQiIC8+CiAgICAgICAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQyIiBmb250LXdlaWdodD0ibm9ybWFsIiBsZXR0ZXItc3BhY2luZz0iNXB4IiBmaWxsPSIjNTU2QjJGIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5aRUw8L3RleHQ+CiAgICA8L3N2Zz4=' });
INITIAL_MELIA_BRANDS.push({
        id: 'brand_zel',
        name: 'ZEL',
        colors: ["#556B2F", "#E2725B", "#C2B280"],
        logoIds: ['asset_logo_brand_zel'],
        fontIds: {}
    });
