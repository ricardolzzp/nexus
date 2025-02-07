using { novaconsulting as db } from '../db/data-model';

service Admin {
    entity Users as projection on db.User;
    entity Tenants as projection on db.Tenant;
    entity TenantUsers as projection on db.TenantUsers;
    entity Products as projection on db.Product;
}

service Nexus {
    entity TenantUsers as projection on db.TenantUsers;
}
