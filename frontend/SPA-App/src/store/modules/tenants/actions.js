export const getTenantCnpjRequest = cnpj => {
  return {
    type: 'tenants/GET_TENANT_CNPJ',
    payload: { cnpj }
  }
}

export const addTenant = tenant => {
  return {
    type: 'tenants/ADD_TENANT',
    payload: { tenant }
  }
}

export const tenantCleanError = (errors) => {
  return {
    type: 'tenants/CLEAN_ERROR',
    payload: {
      errors
    }
  }
}

export const addTenantValidate = (tenant) => {
  return {
    type: 'tenants/ADD_TENANT_VALIDATE',
    payload: {tenant}
  }
}

export const addTenantFail = (tenant, errors) => {
  return {
    type: 'tenants/ADD_TENANT_FAIL',
    payload: {
      tenant,
      errors
    }
  }
}

export const addTenantUuid = (uuid_tenant) => {
  return {
    type: 'tenants/ADD_TENANT_UUID',
    payload: {
      uuid_tenant
    }
  }
}

export const resetTenantsForm = () => {
  return {
    type: 'tenants/RESET_FORM'
  }
}

export const formSuccess = () => {
  return {
    type: 'tenants/FORM_SUCCESS'
  }
}

export const formSuccessSteps = () => {
  return {
    type: 'tenants/FORM_SUCCESS_STEP'
  }
}

export const getTenantSuccessCnpj = (data) => {
  return {
    type: 'tenants/GET_SUCCESS_CNPJ',
    payload: {
      data
    }
  }
}

export const resetTenantForm = () => {
  return {
    type: 'tenants/RESET_FORM'
  }
}

export const editTenant = (tenant, logo) => {
  return {
    type: 'tenants/EDIT_TENANT',
    payload: {
      tenant,
      logo
    }
  }
}