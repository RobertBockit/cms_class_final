import type { Schema, Struct } from '@strapi/strapi';

export interface ContactDataContactData extends Struct.ComponentSchema {
  collectionName: 'components_contact_data_contact_data';
  info: {
    displayName: 'Contact Data';
  };
  attributes: {
    email: Schema.Attribute.Email;
    first_name: Schema.Attribute.String;
    last_name: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'contact-data.contact-data': ContactDataContactData;
    }
  }
}
