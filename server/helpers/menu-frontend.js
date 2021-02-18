const getMenuFrontEnd = (role) => {
    const menu = [{
            titulo: 'Facturas',
            icono: 'icon-cart2',
            submenu: [
                { titulo: 'Facturar', url: 'facturar' },
            ]
        },
        {
            titulo: 'Proformas',
            icono: 'icon-dash',
            submenu: [
                { titulo: 'Proformar', url: 'proformar' },
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Clientes', url: 'clientes' },
            ]
        }
    ];

    if (role === '1') {
        menu[2].submenu.push({ titulo: 'Formas de pago', url: 'formasPago' }, { titulo: 'Unidades', url: 'unidades' }, { titulo: 'Productos', url: 'productos' }, { titulo: 'Impuesto', url: 'impuesto' }, { titulo: 'Sucursales', url: 'sucursales' });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}