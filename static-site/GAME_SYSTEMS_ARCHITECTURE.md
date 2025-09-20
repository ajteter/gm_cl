# Game Systems Architecture

## Overview

This project implements two independent game systems with different advertising configurations:

- **Game1 System**: Original game system with existing ad network
- **Game2 System**: Alternative game system with Adcash advertising

## System Comparison

| Feature | Game1 System | Game2 System | Game3 System |
|---------|--------------|--------------|--------------|
| **Routes** | `/game`, `/game/random`, `/game/play` | `/game2`, `/game2/random`, `/game2/play` | `/game3`, `/game3/random`, `/game3/play` |
| **Ad Network** | Original ad network (iframe-based) | Adcash (direct page rendering) | Game1-based ad network (iframe-based) |
| **Components** | Original components | Dedicated Game2 components | Dedicated Game3 components |
| **Independence** | ✅ Completely isolated | ✅ Completely isolated | ✅ Completely isolated |

## Game1 System

### Routes
- `/game` - Game listing page
- `/game/random` - Daily random game page
- `/game/play` - Game playing page

### Components
- `HomePage` - Main game listing
- `GamePage` - Individual game page
- `RandomGamePage` - Daily random game
- `PlayPage` - Game player
- `GameClientUI` - Game client interface
- `GameList` - Game list component
- `GameCard` - Individual game card

### Ad Configuration
- **Network**: Original ad network
- **Implementation**: iframe-based ads
- **Keys**: 
  - Random game: `e689411a7eabfbe7f506351f1a7fc234`
  - Play page: `9adddfc2b9f962e7595071bcbd5cc4e5`
  - Game list: `268fd9be7cb5acbc21f157c5611ba04f`

## Game2 System

### Routes
- `/game2` - Game listing page (Game2)
- `/game2/random` - Daily random game page (Game2)
- `/game2/play` - Game playing page (Game2)

### Components
- `HomePage2` - Main game listing (Game2)
- `Game2Page` - Individual game page (Game2)
- `RandomGame2Page` - Daily random game (Game2)
- `Play2Page` - Game player (Game2)
- `GameClientUI2` - Game client interface (Game2)
- `GameList2` - Game list component (Game2)
- `GameCard2` - Individual game card (Game2)
- `AdcashAd` - Adcash advertisement component

### Ad Configuration
- **Network**: Adcash
- **Implementation**: Direct page rendering (no iframe)
- **Zone ID**: `10422246`
- **Script**: `//acscdn.com/script/aclib.js`
- **Method**: `aclib.runBanner({zoneId: '10422246'})`

## Game3 System

### Routes
- `/game3` - Game listing page (Game3)
- `/game3/random` - Daily random game page (Game3)
- `/game3/play` - Game playing page (Game3)

### Components
- `HomePage3` - Main game listing (Game3)
- `Game3Page` - Individual game page (Game3)
- `RandomGame3Page` - Daily random game (Game3)
- `Play3Page` - Game player (Game3)
- `GameClientUI3` - Game client interface (Game3)
- `GameList3` - Game list component (Game3)
- `GameCard3` - Individual game card (Game3)

### Ad Configuration
- **Network**: Game1-based ad network (with different keys)
- **Implementation**: iframe-based ads (same as Game1)
- **Keys**: Placeholder keys for Game3 specific configuration
- **Format**: Same iframe structure as Game1 system

## Key Differences

### Advertisement Implementation

**Game1 System (iframe-based)**:
```javascript
<iframe srcDoc={`
  <script>
    window.atOptions = {
      'key': 'ad_key',
      'format': 'iframe',
      'height': 50,
      'width': 320,
      'params': {}
    };
  </script>
  <script src="//ad_network_url/invoke.js"></script>
`} />
```

**Game2 System (direct rendering)**:
```javascript
import AdcashAd from './AdcashAd'

<AdcashAd zoneId="10422246" />
```

### Navigation Behavior

**Game1 System**:
- Game cards navigate to `/game/play?url=...`
- "More Games" buttons navigate to `/game`

**Game2 System**:
- Game cards navigate to `/game2/play?url=...`
- "More Games" buttons navigate to `/game2`

## File Structure

```
src/
├── components/
│   ├── GameClientUI.jsx      # Game1 system
│   ├── GameClientUI2.jsx     # Game2 system
│   ├── GameList.jsx          # Game1 system
│   ├── GameList2.jsx         # Game2 system
│   ├── GameCard.jsx          # Game1 system
│   ├── GameCard2.jsx         # Game2 system
│   └── AdcashAd.jsx          # Game2 system only
├── pages/
│   ├── HomePage.jsx          # Game1 system
│   ├── HomePage2.jsx         # Game2 system
│   ├── GamePage.jsx          # Game1 system
│   ├── Game2Page.jsx         # Game2 system
│   ├── RandomGamePage.jsx    # Game1 system
│   ├── RandomGame2Page.jsx   # Game2 system
│   ├── PlayPage.jsx          # Game1 system
│   └── Play2Page.jsx         # Game2 system
```

## Testing

### Game1 System Testing
- Visit `/game` for game listing
- Visit `/game/random` for daily game
- Visit `/game/play?url=<game_url>` for playing

### Game2 System Testing
- Visit `/game2` for game listing
- Visit `/game2/random` for daily game
- Visit `/game2/play?url=<game_url>` for playing
- Visit `/ad-test` for Adcash ad testing

### Game3 System Testing
- Visit `/game3` for game listing
- Visit `/game3/random` for daily game
- Visit `/game3/play?url=<game_url>` for playing

## Deployment Considerations

### Route Testing
All systems are tested in deployment scripts:
- `scripts/verify-deployment.js`
- `scripts/test-local-deployment.js`

### SEO Configuration
All systems have dedicated SEO configurations in `Layout.jsx`:
- Game1: `/game`, `/game/random`, `/game/play`
- Game2: `/game2`, `/game2/random`, `/game2/play`
- Game3: `/game3`, `/game3/random`, `/game3/play`

## Maintenance Notes

1. **Independence**: All three systems are completely independent and can be modified without affecting each other
2. **Ad Networks**: Each system uses different ad networks and implementations
3. **Components**: No shared components between systems (except common utilities)
4. **Testing**: All systems have separate test coverage
5. **Deployment**: All systems are verified in deployment processes

## Future Considerations

- Systems can be extended independently
- Additional game systems (Game4, Game5, etc.) can be added following the same pattern
- Ad configurations can be modified per system without cross-impact
- Performance optimizations can be applied per system
- Game3 demonstrates how to easily clone and customize existing systems