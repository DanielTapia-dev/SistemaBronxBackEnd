const getMenuFrontEnd = (role) => {
    const menu = [{
            titulo: 'Facturas',
            icono: 'icon-cart2',
            submenu: [
                { titulo: 'Facturar', url: 'facturar' },
                { titulo: 'Lista de facturas', url: 'listafacturas' },
            ]
        },
        {
            titulo: 'Proformas',
            icono: 'icon-dash',
            submenu: [
                { titulo: 'Proformar', url: 'proformar' },
                { titulo: 'Lista de proformas', url: 'listaproformas' },
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
        menu[2].submenu.push({ titulo: 'Usuarios', url: 'usuarios' }, { titulo: 'Formas de pago', url: 'formasPago' }, 
        { titulo: 'Unidades', url: 'unidades' }, { titulo: 'Productos', url: 'productos' }, 
        { titulo: 'Impuesto', url: 'impuesto' }, { titulo: 'Sucursales', url: 'sucursales' }, 
        { titulo: 'Familia', url: 'familia' }, { titulo: 'Serie de Comprobantes', url: 'serie' },
        { titulo: 'Cajas', url: 'caja' },{ titulo: 'Usuarios Asignados a Caja', url: 'usuariocajas'});
        menu.push({
            titulo: 'Reporteria',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Reportes facturas', url: 'reporteFactura' },
            ]
        });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}