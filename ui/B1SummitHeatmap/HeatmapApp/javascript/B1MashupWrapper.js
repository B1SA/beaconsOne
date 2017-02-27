function OpenBPForm(cardCode)
{
    sap.sbo.webbridge.openForm("OCRD", cardCode);
    return true;
}


function OpenItemForm(itemCode)
{
    sap.sbo.webbridge.openForm("OITM", itemCode);
    return true;
}