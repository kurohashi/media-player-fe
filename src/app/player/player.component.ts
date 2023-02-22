import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ApiHandlerService } from '../shared/api-handler-service/api-handler.service';
import { Song } from '../shared/models/media';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  loading = true;
  total = 0;
  sort = "title";
  dir: "asc" | "desc" = "asc";
  page = 1;
  tableData: Song[] = [];
  displayedColumns: string[] = [];
  search: string = "";
  constructor(
    private api: ApiHandlerService,
  ) { }

  ngOnInit(): void {
    this.setDisplayedColumns();
    this.getSongs();
  }

  setDisplayedColumns() {
    let blankSong: Song = {
      "id": "093PI3mdUvOSlvMYDwnV1e",
      "title": "11:11",
      "danceability": 0.445,
      "energy": 0.528,
      "key": 10,
      "loudness": -7.243,
      "mode": 1,
      "acousticness": 0.677,
      "instrumentalness": 0,
      "liveness": 0.155,
      "valence": 0.511,
      "tempo": 203.155,
      "duration_ms": 223452,
      "time_signature": 4,
      "num_bars": 187,
      "num_sections": 12,
      "num_segments": 776,
      "class": 1,
      "rating": 1
    };
    this.displayedColumns = Object.keys(blankSong).slice(1);
  }

  private getSongs() {
    this.loading = true;
    let query = { sort: this.sort, dir: this.dir, page: this.page, title: "" };
    if (this.search)
      query.title = this.search;
    return this.api.callHttp("songs", "get", query).pipe(take(1)).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp && resp.statusCode == 200) {
          this.loadTable(resp.data);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert("Some error occurred, please refresh and try again");
      },
    });
  }

  private loadTable(tableData: { data: Song[], total: number }) {
    this.total = tableData.total;
    this.tableData = tableData.data;
  }

  sortTable(event: any) {
    this.sort = event.active;
    this.dir = event.direction;
    this.getSongs();
  }

  paginate(event: any) {
    this.page = event.pageIndex + 1;
    this.getSongs();
  }

  applyFilter(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.getSongs();
  }

}
