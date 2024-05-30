export interface PokemonDetail {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: Ability[];
    forms: Form[];
    game_indices: GameIndex[];
    held_items: HeldItem[];
    location_area_encounters: string;
    moves: Move[];
    species: Species;
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
  }
  
  interface Ability {
    ability: Resource;
    is_hidden: boolean;
    slot: number;
  }
  
  interface Form {
    name: string;
    url: string;
  }
  
  interface GameIndex {
    game_index: number;
    version: Resource;
  }
  
  interface HeldItem {
    item: Resource;
    version_details: VersionDetail[];
  }
  
  interface Move {
    move: Resource;
    version_group_details: VersionGroupDetail[];
  }
  
  interface Species {
    name: string;
    url: string;
  }
  
  interface Sprites {
    back_default: string;
    back_female: string | null;
    back_shiny: string;
    back_shiny_female: string | null;
    front_default: string;
    front_female: string | null;
    front_shiny: string;
    front_shiny_female: string | null;
  }
  
  interface Stat {
    base_stat: number;
    effort: number;
    stat: Resource;
  }
  
  interface Type {
    slot: number;
    type: Resource;
  }
  
  interface Resource {
    name: string;
    url: string;
  }
  
  interface VersionDetail {
    rarity: number;
    version: Resource;
  }
  
  interface VersionGroupDetail {
    level_learned_at: number;
    move_learn_method: Resource;
    version_group: Resource;
  }