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

## Community

- OSM Cambodia and the [Humanitarian OpenStreetMap Team (HOT)](https://www.hotosm.org) organise mapping events.
- Read the [OSM beginner's guide](https://wiki.openstreetmap.org/wiki/Beginners%27_guide) first.
