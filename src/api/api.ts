import {None, Option, Some, SongKeys} from '../models';

export class Api {
  private readonly _songKeysUrl = '' as const;

  private _songKeys: Option<SongKeys> = None();

  async getSongKeys(): Promise<SongKeys> {
    if (this._songKeys.isNone()) {
      const response = await fetch('/api/song_keys');
      const json = await response.json();
      this._songKeys = Some(json);
    }

    return this._songKeys.unwrap();
  }
}
