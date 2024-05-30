import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { PokemonDetail } from '../../models/pokemon-detail.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.css'
})
export class PokemonInfoComponent {
  route = inject(ActivatedRoute)
  http = inject(HttpClient);
  pokemonName: string = '';
  pokemonInfo!: PokemonDetail;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pokemonName = params['name'];
      this.getPokemonInfo(this.pokemonName).subscribe((info: PokemonDetail) => {
        this.pokemonInfo = info;
      });
    });
  }
  
  getPokemonInfo(pokemonName: string): Observable<PokemonDetail> {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
    return this.http.get<PokemonDetail>(apiUrl);
  }
}
