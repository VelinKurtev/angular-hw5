import { Routes } from '@angular/router';
import { PokemonCatalogueComponent } from './components/pokemon-catalogue/pokemon-catalogue.component';
import { PokemonInfoComponent } from './components/pokemon-info/pokemon-info.component';

export const routes: Routes = [
    { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
    { path: 'pokemons', component: PokemonCatalogueComponent },
    { path: 'pokemon/:name', component: PokemonInfoComponent }
];
