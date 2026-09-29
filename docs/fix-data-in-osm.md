# Fixing map data in OpenStreetMap

All places on this map come from OpenStreetMap (OSM). If something is wrong or missing, fix it in OSM. That fixes it for this project **and** for every other app that uses OSM.

## Steps

1. Create a free account at https://www.openstreetmap.org.
2. Zoom to the place and click **Edit**. The iD editor opens in your browser.
3. Add or fix the place. Useful tags for this project:

| What               | Tags                                             |
| ------------------ | ------------------------------------------------ |
| Tourist attraction | `tourism=attraction`                             |
| Museum             | `tourism=museum`                                 |
| Viewpoint          | `tourism=viewpoint`                              |
| Hotel / guesthouse | `tourism=hotel`, `tourism=guest_house`           |
| Temple / pagoda    | `amenity=place_of_worship` + `religion=buddhist` |
| Bus stop           | `highway=bus_stop`                               |
| Bus station        | `amenity=bus_station`                            |
| Ferry terminal     | `amenity=ferry_terminal`                         |
| Names              | `name`, `name:km`, `name:en`                     |

4. Save with a short description, e.g. "Add Khmer name for Wat Phnom".

Your change appears in our map the next time the data is rebuilt (Geofabrik updates daily).

## What needs fixing

Every data build writes a checklist of **bus stops without a Khmer name** and **bus lines without stops**, each with a link to OpenStreetMap:

- Online: https://madaski-acz.github.io/JIS/data/data-gaps.md (refreshed every Monday)
- Locally: `data/out/data-gaps.md` after `pnpm data:build`

To add stops to a bus line, open its route relation in the iD editor and add each bus stop as a member with role `platform`, **in the order the bus visits them**. See the [public transport guide](https://wiki.openstreetmap.org/wiki/Public_transport).

## Community

- OSM Cambodia and the [Humanitarian OpenStreetMap Team (HOT)](https://www.hotosm.org) organise mapping events.
- Read the [OSM beginner's guide](https://wiki.openstreetmap.org/wiki/Beginners%27_guide) first.
