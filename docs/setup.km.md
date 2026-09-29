# ការដំឡើងគម្រោង JIS នៅលើ Windows

[English: README.md](../README.md#quick-start)

ការណែនាំនេះបង្ហាញជំហានម្តងមួយៗ ពីការដំឡើងកម្មវិធីចាំបាច់ រហូតដល់ឃើញផែនទីនៅលើកុំព្យូទ័ររបស់អ្នក។ ចំណាយពេលប្រហែល ១០ ទៅ ១៥ នាទី។

## ១. ដំឡើង Node.js

1. ចូលទៅ https://nodejs.org ហើយទាញយកកំណែ **LTS** (22 ឬខ្ពស់ជាងនេះ)។
2. បើកឯកសារ `.msi` ដែលបានទាញយក ហើយចុច **Next** រហូតដល់ចប់។
3. បើក **PowerShell** (ចុច Start ហើយវាយ `PowerShell`) រួចពិនិត្យ៖

```powershell
node --version
```

ត្រូវតែឃើញ `v22...` ឬខ្ពស់ជាងនេះ។

## ២. បើក pnpm

គម្រោងនេះប្រើ **pnpm** (មិនមែន npm ឬ yarn ទេ)។ pnpm មកជាមួយ Node.js រួចហើយ តាមរយៈ Corepack។ បើក PowerShell ជា **Administrator** (ចុចស្តាំលើ PowerShell → **Run as administrator**) ហើយវាយ៖

```powershell
corepack enable
```

បិទ PowerShell រួចបើកម្តងទៀត (មិនចាំបាច់ជា Administrator ទេ) ហើយពិនិត្យ៖

```powershell
pnpm --version
```

## ៣. ដំឡើង Git និងទាញយកគម្រោង

1. ទាញយក Git ពី https://git-scm.com/download/win ហើយដំឡើងដោយប្រើការកំណត់លំនាំដើម។
2. នៅក្នុង PowerShell សូមវាយ៖

```powershell
git clone https://github.com/madaSKi-acz/JIS.git
cd JIS
```

## ៤. ដំឡើង និងរៀបចំ

```powershell
pnpm install
Copy-Item .env.example .env
```

(នៅលើ Linux ឬ macOS ប្រើ `cp .env.example .env` ជំនួសវិញ។)

## ៥. បង្កើតទិន្នន័យផែនទី

```powershell
pnpm data:build
```

ពាក្យបញ្ជានេះទាញយកទិន្នន័យកម្ពុជាពី OpenStreetMap (ប្រហែល 50 MB) ទៅក្នុងថត `data/raw/` ហើយបង្កើតស្រទាប់ទេសចរណ៍ និងការដឹកជញ្ជូន។ ការទាញយកលើកដំបូងអាចចំណាយពេលពីរបីនាទី។ ក្រោយមកវាប្រើច្បាប់ចម្លងដែលមានរួច រហូតដល់ ៧ ថ្ងៃ។

## ៦. បើកផែនទី

```powershell
pnpm dev
```

បើកកម្មវិធីរុករក (Chrome, Edge ...) ទៅកាន់ http://localhost:5173 ។ ដើម្បីបញ្ឈប់ សូមចុច `Ctrl + C` នៅក្នុង PowerShell។

## បញ្ហាដែលជួបញឹកញាប់

| បញ្ហា                                                        | ដំណោះស្រាយ                                                                                                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm` is not recognized                                     | ដំណើរការ `corepack enable` ជា Administrator ម្តងទៀត ហើយបើក PowerShell ថ្មី។                                                                         |
| `running scripts is disabled on this system`                 | វាយ `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ក្នុង PowerShell ហើយឆ្លើយ `Y`។                                                            |
| ផែនទីបង្ហាញសារ «រកមិនឃើញទិន្នន័យផែនទី»                       | មិនទាន់បានដំណើរការ `pnpm data:build` ឬវាបរាជ័យ។ សូមដំណើរការវាម្តងទៀត ហើយអានសារកំហុស។                                                                |
| បានទាញយកឯកសារ `.osm.pbf` ដោយខ្លួនឯង តែ `data:build` រកមិនឃើញ | ឯកសារត្រូវនៅ `data/raw/cambodia-latest.osm.pbf` ពិតប្រាកដ (ថតឈ្មោះ `raw` មិនមែន `raws` ទេ)។ ឬប្រើ `pnpm data:build --input ផ្លូវ\ទៅ\ឯកសារ.osm.pbf`។ |
| ការទាញយកយឺត ឬដាច់                                            | សាកល្បងម្តងទៀតនៅពេលអ៊ីនធឺណិតល្អជាងមុន ឬទាញយកដោយផ្ទាល់ពី https://download.geofabrik.de/asia/cambodia.html ទៅក្នុង `data/raw/`។                       |
| Port 5173 is in use                                          | កម្មវិធីមួយទៀតកំពុងប្រើ port នោះ។ បិទវា ឬមើល URL ថ្មីដែល `pnpm dev` បង្ហាញ។                                                                         |

## ជំហានបន្ទាប់

- មុនពេលផ្ញើការផ្លាស់ប្តូរ សូមដំណើរការ `pnpm check` (ពិនិត្យទម្រង់កូដ lint typecheck និងតេស្ត)។
- អាន [CONTRIBUTING.md](../CONTRIBUTING.md) និងជ្រើសរើស issue ដែលមានស្លាក [`good first issue`](https://github.com/madaSKi-acz/JIS/labels/good%20first%20issue)។
- ចង់កែទិន្នន័យផែនទី? មើល [docs/fix-data-in-osm.md](fix-data-in-osm.md)។
