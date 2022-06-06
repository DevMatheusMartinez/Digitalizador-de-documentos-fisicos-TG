import {
    Card,
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Form
} from "reactstrap"
import React, { useEffect, useState } from "react"
import {
    applyMaskToCpfCnpj,
    getOnlyNumberFromString,
    maskBirthday,
    applyMaskToPhone
} from "../../../support/masks"
import { maritalStatusList, ufList } from "../../../support/constants"
import {
    FaRegAddressCard
} from "react-icons/fa"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addAddressEditSaved, addContactEditSaved, addBankEditSaved, addConjugeEditSaved, addCustomerEditSaved, addIncomesEditSaved, editCustomer, resetCustomerFormEdit, resetCustomerFormEditSaved } from "../../../store/modules/customers/actions"
import Toggle from "react-toggle"
import "react-toggle/style.css"
import "../../styles/react-toggle.scss"
import { AlertTriangle, Briefcase, CreditCard, MapPin, Phone, User } from "react-feather"
import { BankForm } from "../components/bankForm"
import { FormCustomer } from "../components/formCustomer"
import { AddressForm } from "../components/addressForm"
import { IncomeForm } from "../components/incomeForm"
import { ContactForm } from "../components/contactForm"
import { GroupButtons } from "../components/groupButtons"
import { SweetAlertQuestion, SweetAlertSuccess } from "../components/sweetAlertMessage"
import { useHistory } from "react-router-dom"
import { addTab } from "../../../store/modules/navbar/actions"

const FullForm = props => {
    const dispatch = useDispatch()
    const customerSaved = useSelector(state => state.customers.customerEditSaved)
    const addressSaved = useSelector(state => state.customers.addressEditSaved)
    const incomeSaved = useSelector(state => state.customers.incomeEditSaved)
    const contactSaved = useSelector(state => state.customers.contactEditSaved)
    const bankSaved = useSelector(state => state.customers.bankEditSaved)
    const [customer, setCustomer] = useState(customerSaved.length !== 0 ? customerSaved : props.location.state.customerDataView)
    const [address, setAddress] = useState(
        () => {
            if (addressSaved.length !== 0) {
                return addressSaved
            }
            if (customer.address !== null) {
                return customer.address
            }
            return {}
        })
    const [active, setActive] = useState("personalData")
    const errors = useSelector(state => state.customers.errorsEdit)
    const formSuccess = useSelector(state => state.customers.formSuccessEdit)
    const [popoverOpen, setPopoverOpen] = useState({
        personal: false,
        address: false,
        spouse: false,
        incomes: false,
        contacts: false,
        banks: false
    })
    const [loading, setLoading] = useState(false)
    const [inputContacts, setInputContacts] = useState(contactSaved.length !== 0 ? contactSaved : customer.contacts)
    const [conjuge, setConjuge] = useState({})
    const [tabConjuge, setTabConjuge] = useState(customer.spouse !== null)
    const [inputIncomes, setInputIncomes] = useState(incomeSaved.length !== 0 ? incomeSaved : customer.incomes)
    const [inputBanks, setInputBanks] = useState(bankSaved.length !== 0 ? bankSaved : customer.banking_references)
    const tabs = useSelector(state => state.navbar.tabs)
    const history = useHistory()

    function removeById(array, id) {
        return array.filter(function (el) {
            return el.id !== id
        })
    }

    useEffect(() => {
        dispatch(addCustomerEditSaved(customer))
        dispatch(addConjugeEditSaved(conjuge))
        dispatch(addIncomesEditSaved(inputIncomes))
        dispatch(addContactEditSaved(inputContacts))
        dispatch(addAddressEditSaved(address))
        dispatch(addBankEditSaved(inputBanks))
    })

    const toggle = tab => {
        return active !== tab && setActive(tab)
    }
    const getAddressByZipcode = zipcode => {
        setLoading(true)
        axios.get(`https://viacep.com.br/ws/${zipcode}/json/`)
            .then(response => {
                const addressInfo = response.data
                setAddress({
                    ...address,
                    address: addressInfo.logradouro ?? '',
                    city: addressInfo.localidade ?? '',
                    neighborhood: addressInfo.bairro ?? ''
                })
                setLoading(false)

            })
            .catch(err => {
                setLoading(false)
            })
    }

    const saveCustomer = async () => {
        const customerToSave = {
            ...customer,
            ...conjuge,
            spouse_on: tabConjuge,
            address: { ...address },
            contacts: inputContacts,
            banking_references: inputBanks,
            incomes: inputIncomes
        }

        dispatch(editCustomer(customerToSave))
    }

    String.prototype.reverse = function () {
        return this.split('').reverse().join('')
    }

    const closeForm = () => {
        if (tabs.length > 1) {
            const objTabs = removeById(tabs, props.location.state.id)

            if (objTabs.length - 1 >= 0) {
                const itemCurrent = objTabs[objTabs.length - 1]
                itemCurrent.active = true
                history.push({
                    pathname: itemCurrent.navLink,
                    state: itemCurrent.state
                })
                dispatch(addTab([...objTabs]))
                dispatch(resetCustomerFormEditSaved())
                return
            }
        }
        history.push({
            pathname: '/clientes',
            state: []
        })
        dispatch(addTab(
            [
                {
                    id: 'customers',
                    name: 'Clientes',
                    active: true,
                    navLink: '/clientes'
                }
            ]
        ))
        dispatch(resetCustomerFormEditSaved())
    }

    useEffect(() => {
        if (formSuccess) {
            SweetAlertSuccess("Finalizado", "O cliente foi alterado com sucesso!", "success", function () {
                closeForm()
            }
            )
            dispatch(resetCustomerFormEdit())
            dispatch(resetCustomerFormEditSaved())
        }
    }, [formSuccess])

    useEffect(() => {
        if (customer.uuid) {
            setCustomer({
                ...customer,
                cpf_cnpj: applyMaskToCpfCnpj(document.getElementById('data-cpfCnpj').value)
            })
        }

        if (customer.spouse) {
            setConjuge({
                spouse: customer.spouse,
                spouse_birthday: customer.spouse_birthday,
                spouse_cpf: customer.spouse_cpf,
                spouse_rg: customer.spouse_rg,
                spouse_rg_org: customer.spouse_rg_org,
                spouse_rg_uf: customer.spouse_rg_uf,
                spouse_rg_date: customer.spouse_rg_date,
                spouse_gender: customer.spouse_gender,
                spouse_contact: customer.spouse_contact,
                spouse_nationality: customer.spouse_nationality,
                spouse_naturalness: customer.spouse_naturalness,
                spouse_naturalness_uf: customer.naturalness_uf,
                spouse_email: customer.spouse_email,
                spouse_mother: customer.spouse_mother,
                spouse_father: customer.spouse_father,
                spouse_commercial_phone: customer.spouse_commercial_phone,
                spouse_home_phone: customer.spouse_home_phone
            })
            return
        }
        setConjuge({
            spouse: null,
            spouse_birthday: null,
            spouse_rg: null,
            spouse_rg_org: null,
            spouse_rg_uf: null,
            spouse_rg_date: null,
            spouse_gender: null,
            spouse_contact: null,
            spouse_nationality: null,
            spouse_naturalness: null,
            spouse_naturalness_uf: null,
            spouse_email: null,
            spouse_mother: null,
            spouse_father: null
        })

    }, [])


    const activeClass = { borderBottom: '#106aae solid 2px', borderRadius: '2px', color: '#106aae' }
    const errorClass = { borderBottom: '#ea5455 solid 2px', borderRadius: '2px', color: '#ea5455' }
    const [styleTabPersonal, setStyleTabPersonal] = useState(activeClass)
    const [styleTabResidential, setStyleTabResidential] = useState({})
    const [styleTabIncome, setStyleTabIncome] = useState({})
    const [styleTabContact, setStyleTabContact] = useState({})
    const [styleTabSpouse, setStyleTabSpouse] = useState({})
    const [styleTabBank, setStyleTabBank] = useState({})
    const [errorPersonal, setErrorPersonal] = useState(false)
    const [errorResidential, setErrorResidential] = useState(false)
    const [errorIncome, setErrorIncome] = useState(false)
    const [errorContact, setErrorContact] = useState(false)
    const [errorSpouse, setErrorSpouse] = useState(false)
    const [errorBank, setErrorBank] = useState(false)

    useEffect(() => {
        setErrorPersonal(false)
        setErrorResidential(false)
        setErrorIncome(false)
        setErrorContact(false)
        setErrorSpouse(false)
        setErrorBank(false)
        if (errors['rg'] !== undefined || errors['birthday'] !== undefined || errors['cpf_cnpj'] !== undefined || errors['name'] !== undefined || errors['contact'] !== undefined) {
            setStyleTabPersonal(errorClass)
            setErrorPersonal(true)
        }

        if (errors['address.number'] !== undefined || errors['address.city'] !== undefined || errors['address.uf'] !== undefined || errors['address.neighborhood'] !== undefined || errors['address.uf']) {
            setStyleTabResidential(errorClass)
            setErrorResidential(true)
        }

        inputIncomes.map((input, index) => {
            if ((errors[`incomes.${index}.occupation`] !== undefined || errors[`incomes.${index}.company`] !== undefined ||
                errors[`incomes.${index}.cnpj`] !== undefined || errors[`incomes.${index}.role`] !== undefined) &&
                (errors[`incomes.${index}.value`] !== undefined || errors[`incomes.${index}.start_date`] !== undefined)) {
                setStyleTabIncome(errorClass)
                setErrorIncome(true)
            }
        })

        if (errors['spouse'] !== undefined || errors['spouse_birthday'] !== undefined || errors['spouse_cpf'] !== undefined || errors['spouse_rg'] !== undefined || errors['spouse_contact'] !== undefined) {
            setStyleTabSpouse(errorClass)
            setErrorSpouse(true)
        }

        inputContacts.map((input, index) => {
            if (errors[`contacts.${index}.type`] !== undefined || errors[`contacts.${index}.contact`] !== undefined) {
                setStyleTabContact(errorClass)
                setErrorContact(true)
            }
        })

        inputBanks.map((input, index) => {
            if (errors[`banking_references.${index}.bank_code`] !== undefined || errors[`banking_references.${index}.type`] !== undefined ||
                errors[`banking_references.${index}.opening_date`] !== undefined || errors[`banking_references.${index}.agência`] !== undefined ||
                errors[`banking_references.${index}.account`] !== undefined) {
                setStyleTabBank(errorClass)
                setErrorBank(true)
            }
        })
    }, [errors])

    return (
        <Form>
            <Card>
                <CardBody>
                    <Nav tabs>
                        <NavItem style={styleTabPersonal}>
                            <NavLink style={{ color: styleTabPersonal.color }}
                                onClick={() => {
                                    toggle("personalData")
                                    setStyleTabPersonal(activeClass)
                                    setStyleTabResidential(errorResidential ? errorClass : {})
                                    setStyleTabIncome(errorIncome ? errorClass : {})
                                    setStyleTabContact(errorContact ? errorClass : {})
                                    setStyleTabSpouse(errorSpouse ? errorClass : {})
                                    setStyleTabBank(errorBank ? errorClass : {})
                                }}
                            >
                                {
                                    errorPersonal ? <AlertTriangle size='18' /> : <FaRegAddressCard size='18' />
                                }
                                {" Pessoais"}
                            </NavLink>
                        </NavItem>
                        <NavItem style={styleTabResidential}>
                            <NavLink style={{ color: styleTabResidential.color }}
                                onClick={() => {
                                    toggle("residentialData")
                                    setStyleTabPersonal(errorPersonal ? errorClass : {})
                                    setStyleTabResidential(activeClass)
                                    setStyleTabIncome(errorIncome ? errorClass : {})
                                    setStyleTabContact(errorContact ? errorClass : {})
                                    setStyleTabSpouse(errorSpouse ? errorClass : {})
                                    setStyleTabBank(errorBank ? errorClass : {})
                                }}
                            >
                                {
                                    errorResidential ? <AlertTriangle size='18' /> : <MapPin size='18' />
                                }
                                {" Residêncial"}
                            </NavLink>
                        </NavItem>
                        <NavItem style={styleTabIncome}>
                            <NavLink style={{ color: styleTabIncome.color }}
                                onClick={() => {
                                    toggle("incomesData")
                                    setStyleTabPersonal(errorPersonal ? errorClass : {})
                                    setStyleTabResidential(errorResidential ? errorClass : {})
                                    setStyleTabIncome(activeClass)
                                    setStyleTabContact(errorContact ? errorClass : {})
                                    setStyleTabSpouse(errorSpouse ? errorClass : {})
                                    setStyleTabBank(errorBank ? errorClass : {})
                                }}
                            >
                                {
                                    errorIncome ? <AlertTriangle size='18' /> : <Briefcase size='18' />
                                }
                                {" Profissional"}
                            </NavLink>
                        </NavItem>
                        <NavItem style={styleTabContact}>
                            <NavLink style={{ color: styleTabContact.color }}
                                onClick={() => {
                                    toggle("contactsData")
                                    setPopoverOpen({ ...popoverOpen, contacts: false })
                                    setStyleTabPersonal(errorPersonal ? errorClass : {})
                                    setStyleTabResidential(errorResidential ? errorClass : {})
                                    setStyleTabIncome(errorIncome ? errorClass : {})
                                    setStyleTabContact(activeClass)
                                    setStyleTabSpouse(errorSpouse ? errorClass : {})
                                    setStyleTabBank(errorBank ? errorClass : {})
                                }}
                            >
                                {
                                    errorContact ? <AlertTriangle size='18' /> : <Phone size='18' />
                                }
                                {" Referências"}
                            </NavLink>
                        </NavItem>
                        {tabConjuge ? (
                            <NavItem style={styleTabSpouse} >
                                <NavLink style={{ color: styleTabSpouse.color }}
                                    onClick={() => {
                                        toggle("spouseData")
                                        setPopoverOpen({ ...popoverOpen, spouse: false })
                                        setStyleTabPersonal(errorPersonal ? errorClass : {})
                                        setStyleTabResidential(errorResidential ? errorClass : {})
                                        setStyleTabIncome(errorIncome ? errorClass : {})
                                        setStyleTabContact(errorContact ? errorClass : {})
                                        setStyleTabSpouse(activeClass)
                                        setStyleTabBank(errorBank ? errorClass : {})
                                    }}
                                >
                                    {
                                        errorSpouse ? <AlertTriangle size='18' /> : <User size='18' />
                                    }
                                    {" Cônjugue"}
                                </NavLink>
                            </NavItem>
                        ) : ''}
                        <NavItem style={styleTabBank} >
                            <NavLink style={{ color: styleTabBank.color }}
                                onClick={() => {
                                    toggle("bankAccountData")
                                    setStyleTabPersonal(errorPersonal ? errorClass : {})
                                    setStyleTabResidential(errorResidential ? errorClass : {})
                                    setStyleTabIncome(errorIncome ? errorClass : {})
                                    setStyleTabContact(errorContact ? errorClass : {})
                                    setStyleTabSpouse(errorSpouse ? errorClass : {})
                                    setStyleTabBank(activeClass)
                                }}
                            >
                                {
                                    errorBank ? <AlertTriangle size='18' /> : <CreditCard size='18' />
                                }
                                {" Bancários"}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={active}>
                        <TabPane tabId="personalData">
                            <FormCustomer
                                tabId="personalData" errors={errors} customer={customer}
                                fieldName="name" idName="data-name" valueName={customer.name ?? ''} nameName="name" functionName={e => setCustomer({ ...customer, name: e.target.value })}
                                fieldBirthday="birthday" idBirthday="data-birthday" valueBirthday={customer.birthday ?? ''} name="birthday" functionBirthday={e => setCustomer({ ...customer, birthday: maskBirthday(e.target.value) })}
                                fieldCpfCnpj="cpf_cnpj" idCpfCnpj="data-cpfCnpj" valueCpfCnpj={customer.cpf_cnpj ?? ''} nameCpfCnpj="cpf_cnpj" functionCpfCnpj={e => setCustomer({ ...customer, cpf_cnpj: applyMaskToCpfCnpj(e.target.value) })}
                                fieldRg="rg" idRg="data-rg" valueRg={customer.rg ?? ''} nameRg="rg" functionRG={e => setCustomer({ ...customer, rg: e.target.value })}
                                fieldRgDate="rg_date" idRgDate="data-rgDate" valueRgDate={customer.rg_date ?? ''} nameRgDate="rg_date" functionRgDate={e => setCustomer({ ...customer, rg_date: maskBirthday(e.target.value) })}
                                fieldOrg="rg_org" idOrg="data-rgOrg" valueOrg={customer.rg_org ?? ''} nameOrg="rg_org" functionOrg={e => setCustomer({ ...customer, rg_org: e.target.value })}
                                fieldRgUf="rgUf" idRgUf="data-rgUf" filterUfRg={customer.rg_uf ? ufList.filter(uf => uf.value === customer.rg_uf) : []} nameUfRg="rgUf" functionUfRg={uf => setCustomer({ ...customer, rg_uf: uf.value })}
                                fieldMaritalStatus="marital_status" idMaritalStatus="data-maritalStatus" filterMaritalStatus={customer.marital_status ? maritalStatusList.filter(maritalStatus => maritalStatus.value === customer.marital_status) : []} nameMaritalStatus="marital_status" functionMaritalStatus={maritalStatus => setCustomer({ ...customer, marital_status: maritalStatus.value })}
                                fieldEmail="email" idEmail="data-email" valueEmail={customer.email ?? ''} nameEmail="email" functionEmail={e => setCustomer({ ...customer, email: e.target.value })}
                                fieldContact="contact" idContact="data-contact" valueContact={customer.contact ?? ''} nameContact="contact" functionContact={e => setCustomer({ ...customer, contact: applyMaskToPhone(e.target.value) })}
                                fieldCommercialPhone="commercialPhone" idCommercialPhone="data-commercialPhone" valueCommercialPhone={customer.commercial_phone ?? ''} nameCommercialPhone="commercialPhone" functionCommercialPhone={e => setCustomer({ ...customer, commercial_phone: applyMaskToPhone(e.target.value) })}
                                fieldHomePhone="homePhone" idHomePhone="data-homePhone" valueHomePhone={customer.home_phone ?? ''} nameHomePhone="homePhone" functionHomePhone={e => setCustomer({ ...customer, home_phone: applyMaskToPhone(e.target.value) })}
                                fieldNationality="nationality" idNationality="data-nationality" valueNationality={customer.nationality ?? ''} nameNationality="nationality" functionNationality={e => setCustomer({ ...customer, nationality: e.target.value })}
                                fieldNaturalness="naturalness" idNaturalness="data-naturalness" valueNaturalness={customer.naturalness ?? ''} nameNaturalness="naturalness" functionNaturalness={e => setCustomer({ ...customer, naturalness: e.target.value })}
                                fieldNaturalnessUf="naturalness_uf" idNaturalnessUf="data-naturalness_uf" filterNaturalnessUf={customer.naturalness_uf ? ufList.filter(uf => uf.value === customer.naturalness_uf) : []} nameNaturalnessUf="naturalness_uf" functionNaturalnessUf={uf => setCustomer({ ...customer, naturalness_uf: uf.value })}
                                fieldMother="mother" idMother="data-mother" valueMother={customer.mother ?? ''} nameMother="mother" functionMother={e => setCustomer({ ...customer, mother: e.target.value })}
                                fieldFather="father" idFather="data-father" valueFather={customer.father ?? ''} nameFather="father" functionFather={e => setCustomer({ ...customer, father: e.target.value })}
                            />

                            <label className="react-toggle-wrapper w-25">
                                <Toggle
                                    defaultChecked={customer.spouse !== null}
                                    className="switch-danger"
                                    onChange={event => {
                                        setTabConjuge(event.target.checked)
                                        setPopoverOpen({ ...popoverOpen, spouse: false })
                                        if (event.target.checked === true) {
                                            setConjuge({
                                                spouse: "",
                                                spouse_birthday: "",
                                                spouse_cpf: "",
                                                spouse_rg: "",
                                                spouse_rg_org: "",
                                                spouse_rg_uf: undefined,
                                                spouse_rg_date: "",
                                                spouse_gender: "",
                                                spouse_nationality: "",
                                                spouse_naturalness: "",
                                                spouse_naturalness_uf: undefined,
                                                spouse_email: "",
                                                spouse_mother: "",
                                                spouse_father: ""
                                            })
                                            return
                                        }

                                        setConjuge({
                                            spouse: null,
                                            spouse_birthday: null,
                                            spouse_rg: null,
                                            spouse_rg_org: null,
                                            spouse_rg_uf: null,
                                            spouse_rg_date: null,
                                            spouse_gender: null,
                                            spouse_contact: null,
                                            spouse_nationality: null,
                                            spouse_naturalness: null,
                                            spouse_naturalness_uf: null,
                                            spouse_email: null,
                                            spouse_mother: null,
                                            spouse_father: null
                                        })
                                    }}
                                />
                                <span className="label-text">Ativar guia Cônjuge</span>
                            </label>
                        </TabPane>
                        <TabPane tabId="spouseData">
                            <FormCustomer tabId="spouseData" errors={errors} customer={conjuge}
                                fieldName="spouse" idName="data-spouse" valueName={conjuge.spouse ?? ''} nameName="spouse"
                                functionName={e => setConjuge({ ...conjuge, spouse: e.target.value })}
                                fieldBirthday="spouse_birthday" idBirthday="data-spouse_birthday"
                                valueBirthday={conjuge.spouse_birthday ?? ''} name="spouse_birthday"
                                functionBirthday={e => setConjuge({ ...conjuge, spouse_birthday: maskBirthday(e.target.value) })}
                                fieldCpfCnpj="spouse_cpf" idCpfCnpj="data-spouse_cpf"
                                valueCpfCnpj={conjuge.spouse_cpf ?? ''} nameCpfCnpj="spouse_cpf"
                                functionCpfCnpj={e => setConjuge({
                                    ...conjuge,
                                    spouse_cpf: applyMaskToCpfCnpj(e.target.value)
                                })}
                                fieldRg="spouse_rg" idRg="data-spouse_rg" valueRg={conjuge.spouse_rg ?? ''}
                                nameRg="spouse_rg" functionRG={e => setConjuge({ ...conjuge, spouse_rg: e.target.value })}
                                fieldRgDate="spouse_rg_date" idRgDate="data-spouse_rg_date"
                                valueRgDate={conjuge.spouse_rg_date ?? ''} nameRgDate="spouse_rg_date"
                                functionRgDate={e => setConjuge({
                                    ...conjuge,
                                    spouse_rg_date: maskBirthday(e.target.value)
                                })}
                                fieldOrg="spouse_rg_org" idOrg="data-spouse_rgOrg" valueOrg={conjuge.spouse_rg_org ?? ''}
                                nameOrg="spouse_rg_org"
                                functionOrg={e => setConjuge({ ...conjuge, spouse_rg_org: e.target.value })}
                                fieldRgUf="spouse_rg_uf" idRgUf="data-rg_uf"
                                filterUfRg={conjuge.spouse_rg_uf ? ufList.filter(uf => uf.value === conjuge.spouse_rg_uf) : []}
                                nameUfRg="spouse_rg_uf"
                                functionUfRg={uf => setConjuge({ ...conjuge, spouse_rg_uf: uf.value })}
                                fieldEmail="spouse_email" idEmail="data-spouse_email"
                                valueEmail={conjuge.spouse_email ?? ''} nameEmail="spouse_email"
                                functionEmail={e => setConjuge({ ...conjuge, spouse_email: e.target.value })}
                                fieldContact="spouse_contact" idContact="data-spouse_contact" valueContact={conjuge.spouse_contact ?? ''} nameContact="spouse_contact" functionContact={e => setConjuge({ ...conjuge, spouse_contact: applyMaskToPhone(e.target.value) })}
                                fieldCommercialPhone="spouse_commercial_phone" idCommercialPhone="data-spouse_commercial_phone" valueCommercialPhone={conjuge.spouse_commercial_phone ?? ''} nameCommercialPhone="spouse_commercial_phone" functionCommercialPhone={e => setConjuge({ ...conjuge, spouse_commercial_phone: applyMaskToPhone(e.target.value) })}
                                fieldCommercialPhone="spouse_home_phone" idCommercialPhone="data-spouse_home_phone" valueHomePhone={conjuge.spouse_home_phone ?? ''} nameHomePhone="spouse_home_phone" functionHomePhone={e => setConjuge({ ...conjuge, spouse_home_phone: applyMaskToPhone(e.target.value) })}
                                fieldNationality="spouse_nationality" idNationality="data-spouse_nationality"
                                valueNationality={conjuge.spouse_nationality ?? ''} nameNationality="spouse_nationality"
                                functionNationality={e => setConjuge({ ...conjuge, spouse_nationality: e.target.value })}
                                fieldNaturalness="spouse_naturalness" idNaturalness="data-spouse_naturalness"
                                valueNaturalness={conjuge.spouse_naturalness ?? ''} nameNaturalness="spouse_naturalness"
                                functionNaturalness={e => setConjuge({ ...conjuge, spouse_naturalness: e.target.value })}
                                fieldNaturalnessUf="spouse_naturalness_uf" idNaturalnessUf="data-spouse_naturalness_uf"
                                filterNaturalnessUf={conjuge.spouse_naturalness_uf ? ufList.filter(uf => uf.value === conjuge.spouse_naturalness_uf) : []}
                                nameNaturalnessUf="spouse-naturalness_uf"
                                functionNaturalnessUf={uf => setConjuge({ ...conjuge, spouse_naturalness_uf: uf.value })}
                                fieldMother="spouse_mother" idMother="data-spouse_mother"
                                valueMother={conjuge.spouse_mother ?? ''} nameMother="spouse_mother"
                                functionMother={e => setConjuge({ ...conjuge, spouse_mother: e.target.value })}
                                fieldFather="spouse_father" idFather="data-spouse_father"
                                valueFather={conjuge.spouse_father ?? ''} nameFather="spouse_father"
                                functionFather={e => setConjuge({ ...conjuge, spouse_father: e.target.value })}
                            />
                        </TabPane>
                        <TabPane tabId="residentialData">
                            <AddressForm address={address} errors={errors} loading={loading}
                                functionChangeZipcode={e => setAddress({ ...address, zipcode: e.target.value })}
                                onBlurZipcode={e => {
                                    getAddressByZipcode(getOnlyNumberFromString(e.target.value))
                                }}
                                functionChangeAddress={e => setAddress({ ...address, address: e.target.value })}
                                functionChangeNumber={e => setAddress({ ...address, number: e.target.value })}
                                functionChangeComplement={e => setAddress({ ...address, complement: e.target.value })}
                                functionChangeNeighborhood={e => setAddress({ ...address, neighborhood: e.target.value })}
                                functionChangeCity={e => setAddress({ ...address, city: e.target.value })}
                                functionChangeUF={uf => setAddress({ ...address, uf: uf.value })}
                                functionChangeTimeResidence={e => setAddress({ ...address, time_residence: maskBirthday(e.target.value) })}
                                functionChangeTypeResidence={e => setAddress({ ...address, type_residence: e.target.value })}
                            />
                        </TabPane>
                        <TabPane tabId="incomesData">
                            <IncomeForm
                                inputIncomes={inputIncomes}
                                errors={errors}
                                setInputIncomes={obj => setInputIncomes(obj)}
                            />
                        </TabPane>
                        <TabPane tabId="contactsData">
                            <ContactForm
                                inputContacts={inputContacts}
                                errors={errors}
                                setInputContacts={obj => setInputContacts(obj)}
                            />
                        </TabPane>
                        <TabPane tabId="bankAccountData">
                            <BankForm
                                inputBanks={inputBanks}
                                errors={errors}
                                setInputBanks={obj => setInputBanks(obj)}
                            />
                        </TabPane>
                    </TabContent>
                    <hr />
                    <GroupButtons uuid={customer.uuid} functionCancel={() => SweetAlertQuestion("Deseja cancelar o cadastro?", "", "question", closeForm, function () { })}
                        functionSave={() => saveCustomer()} />
                </CardBody>
            </Card>
        </Form>
    )
}
export default FullForm
