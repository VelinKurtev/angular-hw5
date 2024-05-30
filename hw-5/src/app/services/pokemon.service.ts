import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { PokemonDetail, PokemonApiResponse } from '../models/pokemon-detail.model';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http:HttpClient){}

  getAllPokemons(offset: number, limit: number): Observable<{ results: { name: string; url: string }[]; hasNext: boolean }> {
    return this.http.get<PokemonApiResponse>(`${this.apiUrl}?offset=${offset}&limit=${limit}`).pipe(
      map(response => ({
        results: response.results,
        hasNext: response.next !== null,
      }))
    );
  }

  getPokemonInfo(pokemonName: string): Observable<PokemonDetail> {
    const apiUrl = `${this.apiUrl}/${pokemonName.toLowerCase()}`;
    return this.http.get<PokemonDetail>(apiUrl);
  }

  fetchPokemonDetails(pokemons: { name: string; url: string }[]): Observable<{ name: string; info: PokemonDetail }[]> {
    const pokemonInfoRequests = pokemons.map(pokemon =>
      this.getPokemonInfo(pokemon.name).pipe(
        map(info => ({ name: pokemon.name, info }))
      )
    );
    return forkJoin(pokemonInfoRequests);
  }
}
