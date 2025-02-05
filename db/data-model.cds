namespace novaconsulting;

using { cuid, managed } from '@sap/cds/common';

type AutenticationType : String enum {
    SSO               = 'SSO';
    STANDARD          = 'STANDARD';
}

type TenantStatusType: String enum {
    ATIVO       = 'ATIVO';
    INATIVO     = 'INATIVO';
}

entity User: cuid, managed {
    name            : String @title: 'Nome' @Validator: {format: 'string'} @mandatory;
    email           : String @title: 'E-mail' @Validator: {format: 'email'} @mandatory;
    password        : String @title: 'Senha' @Validator: {format: 'string'} @mandatory;
}

entity Product: cuid, managed {
    name: String @title: 'Nome' @Validator: {format: 'string'} @mandatory;
}

entity Tenant: cuid, managed {
    name            : String @title: 'Nome' @Validator: {format: 'string'} @mandatory;
    razaoSocial     : String @title: 'Razão Social' @Validator: {format: 'string'} @mandatory;
    tipoAuth        : AutenticationType @title: 'Tipo de Autenticação';
    ssoClient       : String @title: 'Chave Cliente SSO';
    ssoSecret       : String @title: 'Segredo Cliente SSO';
    status          : TenantStatusType @title: 'Status';
    users           : Association to many TenantUsers on users.tenant = $self;
    products        : Association to many TenantProduct on products.tenant = $self;
}

entity TenantProduct: cuid, managed {
    tenant         : Association to Tenant @mandatory;
    product        : Association to Product @mandatory;
    contractDate   : Date @title: 'Data de Contratação' @mandatory;
    isActive       : Boolean @title: 'Ativo' default true;
}

entity TenantToken: cuid, managed {
    tenant         : Association to Tenant @mandatory; 
    token          : String @title: 'Token' @mandatory; 
    expiresAt      : Timestamp @title: 'Expira em' @mandatory;
    description    : String @title: 'Descrição' @Validator: {format: 'string'};
    isActive       : Boolean @title: 'Ativo' default true;
}

entity TenantUsers: cuid, managed {
    key email       : String(50)    @title: 'E-mail' @Validator: {format: 'email'} @mandatory;
    key username    : String(20)    @title: 'Nome de Usuário'  @Validator: {type: 'string', minLength: 5} @mandatory;
        name        : String(100)   @title: 'Nome Completo' @Validator: {type: 'string', minLength: 5} @mandatory ;
        password    : String        @title: 'Senha' @mandatory @UI.Hidden;
        avatar      : String;
        tenant      : Association to Tenant; 
};