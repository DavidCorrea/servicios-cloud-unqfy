class Artist {
  constructor(id, name, country){
    this.id = id;
    this.name = name;
    this.country = country;

    this._validateFields();
  }

  _validateFields() {
    this._validateFieldIsNotEmpty(this.name, 'Name');
    this._validateFieldIsNotEmpty(this.country, 'Country');
  }

  _validateFieldIsNotEmpty(field, fieldName) {
    if(!field || field.length === 0) {
      throw new Error(`Couldn't create new Artist: ${fieldName} cannot be empty`);
    }
  }
}  

module.exports = Artist;