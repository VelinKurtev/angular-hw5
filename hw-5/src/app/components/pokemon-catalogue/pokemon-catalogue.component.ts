import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PokemonDetail } from '../../models/pokemon-detail.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

export const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
@Component({
  selector: 'app-pokemon-catalogue',
  standalone: true,
  imports: [MatCardModule, HttpClientModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './pokemon-catalogue.component.html',
  styleUrl: './pokemon-catalogue.component.css'
})

export class PokemonCatalogueComponent {
  http = inject(HttpClient);
  router = inject(Router);
  
  pokemons: { [key: string]: PokemonDetail } = {};
  pokemonNames: string[] = [];
  offset = 0;
  limit = 0;
  hasNextPokemons = false;

  getAllPokemons(offset: number, limit: number): Observable<{ name: string, url: string }[]> {
    return this.http.get<{ results: { name: string, url: string }[], next: string }>(`${apiUrl}?offset=${offset}&limit=${limit}`)
      .pipe(map(response => {
        this.hasNextPokemons = !!response.next;
        return response.results;
      }));
  }

  getPokemonInfo(pokemonUrl: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(pokemonUrl);
  }

  ngOnInit() {
    this.loadNextPokemons();
    this.limit += 20;
  }

  loadNextPokemons() {
    this.offset += this.limit;
    this.fetchPokemons();
  }

  loadPreviousPokemons() {
    this.offset -= this.limit;
    this.fetchPokemons();
  }

  fetchPokemons() {
    this.getAllPokemons(this.offset, this.limit).pipe(
      switchMap(pokemons => {
        const pokemonInfoRequests = pokemons.map(pokemon =>
          this.getPokemonInfo(pokemon.url).pipe(
            map(info => ({ name: pokemon.name, info }))
          )
        );
        return forkJoin(pokemonInfoRequests);
      })
    ).subscribe((pokemonDetails: { name: string, info: PokemonDetail }[]) => {
      this.pokemons = {};
      this.pokemonNames = [];
      pokemonDetails.forEach(pokemonDetail => {
        this.pokemons[pokemonDetail.name] = pokemonDetail.info;
        this.pokemonNames.push(pokemonDetail.name);
      });
      console.log(this.pokemons);
    }, error => {
      console.error('Failed to fetch Pokémon details', error);
    });
  }
  
  openPokemonDetails(pokemonName: string) {
    this.router.navigate(['/pokemon', pokemonName]);
  }
}
