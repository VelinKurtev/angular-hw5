import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { PokemonDetail } from '../../models/pokemon-detail.model';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.css'
})
export class PokemonInfoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);

  pokemonName: string = '';
  pokemonInfo!: PokemonDetail;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pokemonName = params['name'];
      this.pokemonService.getPokemonInfo(this.pokemonName).subscribe((info: PokemonDetail) => {
        this.pokemonInfo = info;
      });
    });
  }
}
