using { novaconsulting as db } from '../db/data-model';

service Admin {
    entity Tenants as projection on db.Tenant;
    entity TenantUsers as projection on db.TenantUsers;
}