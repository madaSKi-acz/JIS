# JIS – ផែនទីទេសចរណ៍ និងការដឹកជញ្ជូននៅកម្ពុជា

[English](README.md)

គម្រោងកូដចំហ (open source) សម្រាប់ផែនទីវេបនៃប្រទេសកម្ពុជា ដែលផ្តោតលើ **ទេសចរណ៍** និង **ការដឹកជញ្ជូនសាធារណៈ** ដោយប្រើទិន្នន័យឥតគិតថ្លៃពី [OpenStreetMap](https://www.openstreetmap.org)។ គម្រោងនេះចាប់ផ្តើមជាការសិក្សាផ្ទាល់ខ្លួន ហើយស្វាគមន៍អ្នកអភិវឌ្ឍន៍ខ្មែរទាំងអស់ដែលចង់ចូលរួម។

> ស្ថានភាព៖ **v1.0.0** — មើល [កំណត់ត្រាការផ្លាស់ប្តូរ](CHANGELOG.md) និង [ផែនការ](docs/roadmap.md)។ ទើបមកដល់ថ្មី? សូមមើល issue ដែលមានស្លាក [`good first issue`](https://github.com/madaSKi-acz/JIS/labels/good%20first%20issue)។

## មុខងារ (គោលដៅ v1)

- ផែនទីកម្ពុជា បង្ហាញកន្លែងទេសចរណ៍ សណ្ឋាគារ ប្រាសាទ សារមន្ទីរ និងទីកន្លែងមើលទេសភាព
- ស្រទាប់ការដឹកជញ្ជូន៖ ចំណតឡានក្រុង ស្ថានីយ កំពង់ផែ អាកាសយានដ្ឋាន និងខ្សែរត់ឡានក្រុង
- ជ្រើសរើសខ្សែឡានក្រុង ដើម្បីមើលផ្លូវ និងចំណតតាមលំដាប់
- ចំណុចប្រទាក់ជាភាសាខ្មែរ និងអង់គ្លេស
- ប្រើបានលើទូរស័ព្ទ និងកុំព្យូទ័រ
- ដំណើរការលើកុំព្យូទ័រផ្ទាល់ខ្លួនដោយមិនអស់ប្រាក់

## ចាប់ផ្តើម

ត្រូវការ Node.js 20 ឡើងទៅ (ណែនាំ 22) និង [pnpm](https://pnpm.io/installation) 10 ឡើងទៅ។

```bash
git clone https://github.com/madaSKi-acz/JIS.git
cd JIS
pnpm install
cp .env.example .env
pnpm data:build
pnpm dev
```

បន្ទាប់មកបើក http://localhost:5173។

ទិន្នន័យផែនទី **មិនត្រូវបានរក្សាទុកក្នុង repo នេះទេ**។ វាត្រូវបានបង្កើតនៅលើកុំព្យូទ័ររបស់អ្នកពី OpenStreetMap។ មើល [data/README.md](data/README.md)។

## ការចូលរួម

យើងស្វាគមន៍ការចូលរួមគ្រប់ប្រភេទ — កូដ ការបកប្រែ ឯកសារ ឬការកែទិន្នន័យនៅក្នុង OpenStreetMap។ សូមអាន [CONTRIBUTING.md](CONTRIBUTING.md)។

ឃើញទីកន្លែងខុស ឬខ្វះ? សូមកែវានៅក្នុង OpenStreetMap៖ [docs/fix-data-in-osm.md](docs/fix-data-in-osm.md)។

## អាជ្ញាប័ណ្ណ

- **កូដ៖** [MIT](LICENSE)
- **ទិន្នន័យផែនទី៖** © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) ក្រោមអាជ្ញាប័ណ្ណ [ODbL](https://opendatacommons.org/licenses/odbl/)
