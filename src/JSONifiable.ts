export interface JSONifiable<APIData> {
  toJSON(): APIData;
}
