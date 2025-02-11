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
    fullName        : String @title: 'Nome' @Validator: {format: 'string'} @mandatory;
    email           : String @title: 'E-mail' @Validator: {format: 'email'} @mandatory;

    telefone        : String @title: 'Telefone' @mandatory;
    celular         : String @title: 'Telefone' @mandatory;

    password        : String @title: 'Senha' @Validator: {format: 'string'} @mandatory;
    avatar          : String default '';
    
    logradouro      : String(100) @title: 'Senha' @Validator: {format: 'string'};
    numero          : String(10) @title: 'Senha' @Validator: {format: 'string'};
    complemento     : String(50) @title: 'Senha' @Validator: {format: 'string'};
    bairro          : String(50) @title: 'Senha' @Validator: {format: 'string'};
    cidade          : String(50) @title: 'Senha' @Validator: {format: 'string'};
    estado          : String(2) @title: 'Senha' @Validator: {format: 'string'};
    cep             : String(10) @title: 'Senha' @Validator: {format: 'string'};

    cargo           : String @title: 'Cargo' @Validator: {format: 'string'};
    departamento    : String @title: 'Cargo' @Validator: {format: 'string'};
    isActive        : Boolean @title: 'Ativo' default true;
}

entity Product: cuid, managed {
    name: String @title: 'Nome' @Validator: {format: 'string'} @mandatory;
    isActive        : Boolean @title: 'Ativo' default true;
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
    nexDistDfe      : Association to many nexDistDfe on nexDistDfe.tenant = $self;
    branch          : Composition of many TenantBranch on branch.tenant = $self;
}

entity TenantBranch {
    key ID       : UUID;
    name         : String(100);
    tenant       : Association to Tenant;
    certificate  : Association to Certificates;
}

entity Certificates {
    key ID           : UUID;
    branch         : Association to TenantBranch;
    certificateData  : LargeBinary;
    issuedBy        : String(100);
    validFrom       : Date;
    validTo         : Date;
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
}

entity nexDistDfe: cuid {
    file: String;
    status: String;
    tenant: Association to Tenant;
}