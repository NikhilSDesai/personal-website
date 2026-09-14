# La Rambla Climate Intervention ABM

**Exea Impact × Aretian Urban Analytics**

A pedestrian agent-based model (ABM) for evaluating climate adaptation interventions on La Rambla, Barcelona. This simulation compares urban design scenarios to assess how shade, vegetation, and cooling strategies affect pedestrian behavior during heat events.

## Live Demo

**[View the live simulation](https://nikhilsdesai.github.io/abm-barcelona-rambla/)**

## Project Context

This ABM is part of a larger climate vulnerability analysis for the Barcelona Metropolitan Region. Key findings from the parent study:

| Metric | Value | Implication |
|--------|-------|-------------|
| **Critical Temperature** | 23.2°C | Mortality spikes +8.9% above this threshold |
| **Excess Deaths** | +823/year | When summer exceeds 23.2°C |
| **NDVI Protective Effect** | -55% mortality | Vegetation (NDVI > 0.35) significantly reduces heat deaths |
| **Pre-1980 Buildings** | 74.1% | Lack thermal insulation, increasing heat vulnerability |

## Features

- **Climate Impact Dashboard** - Real-time HVI reduction estimates and intervention effectiveness metrics
- **Climate scenario comparison** - Side-by-side evaluation of current vs. intervention scenarios
- **Shade-seeking behavior** - Agents preferentially use shaded paths when uncrowded
- **Heat vulnerability modeling** - Based on IPCC AR5 framework (Hazard × Sensitivity × Adaptive Capacity)
- **Pedestrian comfort scoring** - Proxemic zone analysis for crowding assessment
- **Real Barcelona data** from Supabase geodatabase:
  - 16 transit stop spawn/destination nodes
  - 1,839 building structures
  - 1,188 tree shade polygons (current) / 1,544 (intervention: +30%)
  - 418 stalls (restaurants, cafes, bars)
  - 50 furniture amenities (current) / 80 (intervention: +60%)

## Climate Impact Dashboard

The **Climate Impact** panel provides real-time metrics:

| Metric | Description |
|--------|-------------|
| **Est. HVI Reduction** | Estimated Heat Vulnerability Index reduction based on intervention infrastructure |
| **Tree Canopy** | Shade feature count comparison (1,188 → 1,544 = +30%) |
| **Cooling Amenities** | Furniture/shelter count comparison (50 → 80 = +60%) |
| **Pedestrian Comfort** | Real-time comfort score based on proxemic zone violations |
| **Active Pedestrians** | Live agent counts in each scenario |

The HVI reduction estimate uses a simplified model based on the NDVI-temperature correlation (r = -0.58) from the Exea Impact study.

## Climate Intervention Scenarios

### Current Scenario (Left Panel)
Existing conditions on La Rambla with current tree coverage and urban configuration.

### Intervention Scenario (Right Panel)
Proposed climate adaptations including:
- +356 additional tree canopy features (+30%)
- +30 cooling amenities and shaded rest areas (+60%)
- 6 heat shelter pavilions (15m diameter)
- Enhanced vegetation corridors

## Agent Behavior

Agents follow an 8-stage movement pipeline each tick:

1. **MNL Route Choice** - Multinomial logit model selects next patch based on distance, alignment, density, obstacles, and **shade preference**
2. **Amenity Engagement** - Probabilistic stopping at stalls or furniture
3. **Surface Recovery** - Gentle push back onto walkable surfaces
4. **Following Behavior** - Queue formation in crowded areas
5. **Heading Momentum** - Smooth heading changes
6. **Weidmann Speed** - Density-dependent speed adjustment
7. **ORCA Collision Avoidance** - Real-time obstacle avoidance
8. **Barrier Snap-back** - Prevents entering structures

### Heat Shelter-Seeking Behavior

When the Heat Event toggle is enabled, agents exhibit strong heat shelter-seeking behavior:
- `β_shade = 5.0` (high preference coefficient for shaded areas)
- `shadeLookahead = 12` patches (~12m visibility for shade detection)
- Shade utility is gated off when local density exceeds 1.5 ped/m² (crowd avoidance dominates)
- Models real pedestrian behavior during extreme heat events (above 23.2°C mortality threshold)

## Technology Stack

- **Vue 3** + **Pinia** for reactive state management
- **MapLibre GL** for map rendering
- **Vite** for build tooling
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Web Workers** for simulation performance

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── public/
│   ├── nodes.geojson              # Spawn/destination points
│   ├── rambla_current/            # Current scenario data
│   │   ├── surfaces.geojson       # Walkable areas
│   │   ├── structures.geojson     # Buildings
│   │   ├── shade.geojson          # Tree canopies (1,188 trees)
│   │   ├── stalls.geojson         # Restaurants/cafes
│   │   └── furniture.geojson      # Street furniture
│   └── rambla_intervention/       # Climate intervention scenario
├── src/
│   ├── components/                # Vue components
│   ├── sim/                       # Simulation engine
│   ├── stores/                    # Pinia stores
│   └── config.ts                  # Simulation parameters
```

## Key Configuration Parameters

From `src/config.ts`:

```typescript
// Heat shelter-seeking behavior (enhanced for heat events)
ROUTE_CHOICE.beta.shade = 5.0       // Strong preference for shaded patches
ROUTE_CHOICE.shadeLookahead = 12    // Patches ahead to sample for shade (~12m)
SURFACE.shadeDensityGate = 1.5      // ped/m² threshold (shade off when crowded)

// Spawn rates (400 persons/hour per node)
nodes.pph = 400                     // High pedestrian flow for visual impact
nodes.interval = 9                  // Spawn interval in seconds
```

## Related Work

This simulation is part of the **Exea Impact × Aretian** climate vulnerability analysis:

- **Heat Vulnerability Index (HVI)**: Census section analysis using IPCC AR5 framework
- **Flood Vulnerability Index (FVI)**: H3 hexagon analysis with 4-component IPCC AR6 framework
- **Mortality Analysis**: 15-year temperature-mortality correlation study

## Data Sources

| Dataset | Provider | Resolution |
|---------|----------|------------|
| Buildings | Spanish Cadastre | Polygon |
| Trees | Barcelona Open Data | Point → 3m buffer |
| Transit Stops | TMB Barcelona | Point |
| Amenities | OpenStreetMap | Point |
| Climate Data | CHELSA v2.1 / Gencat | 1km / 100m |

## References

### Climate Vulnerability
1. IPCC (2014). *Climate Change 2014: Impacts, Adaptation, and Vulnerability*. AR5 Working Group II.
2. Inostroza, L. et al. (2016). *A heat vulnerability index: Spatial patterns of exposure, sensitivity and adaptive capacity*. PLOS ONE.
3. Gasparrini, A. et al. (2015). *Mortality risk attributable to high and low ambient temperature*. The Lancet.
4. Domene, E. et al. (2025). *Vulnerabilitat social al canvi climàtic a l'àrea metropolitana de Barcelona*. Institut Metròpoli.

### Pedestrian Modeling
5. Antonini, Bierlaire & Weber (2006). *Discrete choice models of pedestrian walking behavior*. MNL route choice.
6. van den Berg et al. (2011). *Reciprocal Velocity Obstacles for real-time multi-agent navigation*. ORCA collision avoidance.
7. Weidmann (1993). *Transporttechnik der Fussgänger*. Speed-density relationships.
8. Hall, E.T. (1966). *The Hidden Dimension*. Proxemic zones framework.

## Credits

UX inspired by the [Norman Foster Institute Freetown ABM](https://github.com/Norman-Foster-Institute/abm-model-freetown).

**Aretian Urban Analytics:** Climate Adaptation for Barcelona Metropolitan Region

## License

MIT
