import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PokemonDetail } from '../../models/pokemon-detail.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-catalogue',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './pokemon-catalogue.component.html',
  styleUrl: './pokemon-catalogue.component.css'
})

export class PokemonCatalogueComponent {
  constructor(private pokemonService: PokemonService, private router: Router) { }

  pokemons: { [key: string]: PokemonDetail } = {};
  pokemonNames: string[] = [];
  offset = 0;
  limit = 20;
  hasNextPokemons = false;

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadNextPokemons(): void {
    this.offset += this.limit;
    this.loadPokemons();
  }

  loadPreviousPokemons(): void {
    this.offset = Math.max(this.offset - this.limit, 0);
    this.loadPokemons();
  }

  private loadPokemons(): void {
    this.pokemonService.getAllPokemons(this.offset, this.limit).pipe(
      switchMap(({ results, hasNext }) => {
        this.hasNextPokemons = hasNext;
        return this.pokemonService.fetchPokemonDetails(results);
      })
    ).subscribe(
      pokemonDetails => this.updatePokemonList(pokemonDetails),
      error => console.error('Failed to fetch Pokémon details', error)
    );
  }

  private updatePokemonList(pokemonDetails: { name: string, info: PokemonDetail }[]): void {
    this.pokemons = {};
    this.pokemonNames = [];
    pokemonDetails.forEach(pokemonDetail => {
      this.pokemons[pokemonDetail.name] = pokemonDetail.info;
      this.pokemonNames.push(pokemonDetail.name);
    });
    console.log(this.pokemons);
  }

  openPokemonDetails(pokemonName: string): void {
    this.router.navigate(['/pokemon', pokemonName]);
  }
}
