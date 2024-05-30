import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PokemonDetail } from '../../models/pokemon-detail.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-catalogue',
  standalone: true,
  imports: [MatCardModule, HttpClientModule, CommonModule, MatIconModule],
  templateUrl: './pokemon-catalogue.component.html',
  styleUrl: './pokemon-catalogue.component.css'
})
export class PokemonCatalogueComponent {
  http = inject(HttpClient);
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  pokemons: { [key: string]: PokemonDetail } = {};
  pokemonNames: string[] = [];

  getAllPokemons(): Observable<{ name: string, url: string }[]> {
    return this.http.get<{ results: { name: string, url: string }[] }>(`${this.apiUrl}`)
      .pipe(map(response => response.results));
  }

  getPokemonInfo(pokemonUrl: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(pokemonUrl);
  }

  ngOnInit() {
    this.getAllPokemons().pipe(
      switchMap(pokemons => {
        const pokemonInfoRequests = pokemons.map(pokemon =>
          this.getPokemonInfo(pokemon.url).pipe(
            map(info => ({ name: pokemon.name, info }))
          )
        );
        return forkJoin(pokemonInfoRequests);
      })
    ).subscribe({
      next: (pokemonDetails: { name: string, info: PokemonDetail }[]) => {
        pokemonDetails.forEach(pokemonDetail => {
          this.pokemons[pokemonDetail.name] = pokemonDetail.info;
          this.pokemonNames.push(pokemonDetail.name);
        });
        console.log(this.pokemons);  // For debugging purposes
      },
      error: (err) => {
        console.error('Failed to fetch Pokémon details', err);
      }
    });
  }
}
