# Catalunya Climate Vulnerability Data

**Technical Data Reference**
*See `/exea_impact/README.md` for project overview*

---

## Folder Structure

```
data/
├── 00_Boundary/          # Administrative boundaries
├── 01_Demographic/       # Population & income
├── 02_Heat/              # Temperature data
├── 03_Flood/             # Precipitation & IDF
├── 04_Mortality/         # Deaths data
├── 05_Infrastructure/    # Buildings & network
├── 06_Natural/           # Environmental variables
├── 07_Indices/           # ⭐ COMPUTED OUTPUTS
├── 08_Parcels/           # Cadastral parcels
├── 09_Buildings/         # Building age data
└── 10_H3/                # H3 hexagon analysis
```

**Total: ~15 GB across 2,000+ files**

---

## 00_Boundary/

Census sections and administrative boundaries.

| File | Description | Records |
|------|-------------|---------|
| `01_seccen/catalunya_seccen2025.gpkg` | Census sections 2025 | 5,143 |
| `01_seccen/catalunya_seccen2022.gpkg` | Census sections 2022 | 5,143 |
| `ABS_mapping/ABS_boundaries.geojson` | Health areas (ABS) | 374 |
| `ABS_mapping/census_to_abs_lookup.csv` | Census → ABS mapping | 5,141 |

**CRS**: EPSG:25831 (ETRS89 / UTM zone 31N)

---

## 01_Demographic/

Population and income data from Idescat.

| Subfolder | Contents | Years |
|-----------|----------|-------|
| `population_2025/` | Census population | 2017-2022 |
| `income/` | Median/mean income | Current |
| `idescat_elderly/` | 65+ population by year | 2017-2022 |

**Key file**: `population_by_year_2017_2022.csv` (population time series)

---

## 02_Heat/

Temperature and climate data from multiple sources.

| Subfolder | Source | Resolution | Period |
|-----------|--------|------------|--------|
| `temperature/` | Gencat Climate Atlas | 100m | 1991-2020 (normals) |
| `chelsa_temperature/` | CHELSA v2.1 | 1km | 1979-2021 (monthly) |
| `heat_indices/` | Gencat | 100m | 1991-2020 |
| `albedo/` | MODIS | 10m | 2023 |
| `urbclim/` | VITO Copernicus | 100m | 2008-2017 |

**CHELSA units**: Scaled Kelvin (divide by 10, subtract 273.15 for °C)

---

## 03_Flood/

Precipitation and flood design values.

| Subfolder | Contents | Files |
|-----------|----------|-------|
| `precipitation/` | Monthly/seasonal totals | 18 |
| `flood_idf/` | IDF curves (2-500yr return) | 40 |

---

## 04_Mortality/

Deaths data by census section.

| File | Coverage | Records | Period |
|------|----------|---------|--------|
| `Cat_Mortality/catalunya_deaths_by_census_section_yearly.gpkg` | All Catalunya | 46,287 | 2017-2025 |
| `Cat_Mortality/catalunya_deaths_by_census_section_weighted.gpkg` | All Catalunya | 5,143 | Aggregated |
| `Cat_Mortality/other/barcelona_deaths_total.gpkg` | Barcelona city | 1,068 | 1997-2025 |

**Method**: Deaths distributed from ABS to census sections proportional to elderly (65+) population.

---

## 05_Infrastructure/

Buildings, street network, and facilities.

| Subfolder | Contents | Size |
|-----------|----------|------|
| `01_critical_facilities/` | Climate shelters | 5 MB |
| `02_street_network/` | Barcelona OSM network | 670 MB |
| `03_buildings/` | Overture buildings | 3.2 GB |

---

## 06_Natural/

Environmental and vegetation data.

| Subfolder | Contents | Source |
|-----------|----------|--------|
| `NDVI/` | Vegetation index (1990-2024) | Landsat/GEE |
| `water_bodies/` | Waterbodies | OSM |
| `green_space/` | Parks and gardens | Barcelona |
| `elevation/` | DEM 30m, 90m | ASTER, SRTM |
| `humidity/` | Relative humidity | ERA5 |
| `pollution/` | PM2.5, NO2, O3 | CAMS |

**Key file**: `NDVI/ndvi_by_census_section.gpkg` (zonal stats 1990-2024)

---

## 07_Indices/ ⭐ COMPUTED OUTPUTS

Heat vulnerability indices and visualizations.

### census_section_vulnerability/
IPCC AR5 Heat Vulnerability Index for all 5,143 census sections.

| File | Description |
|------|-------------|
| `heat_vulnerability_by_census_section.csv` | All indicators + scores |
| `vulnerability_summary.csv` | Summary statistics |

**Columns**: `hazard_score`, `sensitivity_score`, `adaptive_capacity_score`, `vulnerability_index`, `vulnerability_category`

### historical_heat_hazard/
43-year temperature analysis (1979-2021).

| File | Records | Description |
|------|---------|-------------|
| `heat_hazard_timeseries_1979_2021.csv` | 221,149 | Full timeseries |
| `annual_heat_statistics.csv` | 43 | Catalunya-wide annual |
| `section_temperature_trends.csv` | 5,143 | Per-section trends |

**Key finding**: +0.54°C/decade warming (all sections significant)

### client_visualizations/
10 publication-ready figures + statistics.

| Figure | Content |
|--------|---------|
| `fig1-5` | Time series (temp, mortality, NDVI) |
| `fig6-10` | Distributions and dashboard |
| `descriptive_statistics.txt` | Text summary |

---

## 08_Parcels/

Cadastral parcel data.

| File | Records |
|------|---------|
| `07_parcels_cat_all.csv` | 2,898,612 |

---

## 09_Buildings/

Building age data from Spanish Cadastre (AMB IVAC methodology).

| File | Records | Description |
|------|---------|-------------|
| `cadastre/processed/buildings_only.csv` | 171,147 | Buildings with construction year |
| `cadastre/processed/buildings_all_metadata.gpkg` | 871,620 | With geometry |
| `cadastre/processed/census_section_building_age.csv` | 156 | By census section |

**AMB IVAC Categories**:
- Pre-1951: 32.7% (most vulnerable)
- 1951-1980: 41.4% (vulnerable)
- 1981-2007: 21.4% (moderate)
- Post-2008: 3.3% (CTE compliant)
- **Pre-1980 total: 74.1%** (no thermal insulation)

---

## 10_H3/

H3 hexagonal grid analysis (multi-resolution).

| File | Resolution | Hexagons | Indicators |
|------|------------|----------|------------|
| `hex_comprehensive_res10.gpkg` | 10 (~15m) | 216,404 | 135 |
| `hex_comprehensive_res9.gpkg` | 9 (~100m) | 31,432 | 130 |
| `hex_comprehensive_res8.gpkg` | 8 (~460m) | 4,673 | 130 |
| `hex_comprehensive_res7.gpkg` | 7 (~1.2km) | 727 | 130 |

**Time series data**:
- `hex_chelsa_by_year.csv` - Temperature 1979-2021
- `hex_ndvi_by_year.csv` - NDVI 1990-2024
- `hex_elderly_by_year.csv` - Population 2017-2022

**Archive**: Component files and duplicates in `archive/`

---

## Coordinate Reference Systems

| CRS | EPSG | Used By |
|-----|------|---------|
| ETRS89 / UTM zone 31N | 25831 | Gencat, census, buildings |
| WGS 84 | 4326 | CHELSA, ABS boundaries |

```python
import geopandas as gpd
gdf = gpd.read_file('file.gpkg').to_crs('EPSG:25831')
```

---

## Quick Access

```python
import geopandas as gpd
import pandas as pd

# Census sections
census = gpd.read_file('00_Boundary/01_seccen/catalunya_seccen2025.gpkg')

# Vulnerability index
vuln = pd.read_csv('07_Indices/census_section_vulnerability/heat_vulnerability_by_census_section.csv')

# Mortality (yearly)
deaths = gpd.read_file('04_Mortality/Cat_Mortality/catalunya_deaths_by_census_section_yearly.gpkg')

# H3 hexagons
h3 = gpd.read_file('10_H3/hex_comprehensive_res10.gpkg')

# Temperature trends
trends = pd.read_csv('07_Indices/historical_heat_hazard/section_temperature_trends.csv')
```

---

*Last updated: August 2026*
