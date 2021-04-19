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
            titulo: 'Contabilidad',
            icono: 'icon-speedometer',
            submenu: [
            ]
        },
        {
            titulo: 'Clientes',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Clientes', url: 'clientes' },
            ]
        },
        {
            titulo: 'Inventario',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Productos', url: 'productos' },
            ]
        },
        {
            titulo: 'Punto de Venta',
            icono: 'icon-speedometer',
            submenu: [
            ]
        },
        {
            titulo: 'Cobros',
            icono: 'icon-speedometer',
            submenu: [
            ]
        },
        {
            titulo: 'Seguridades',
            icono: 'icon-speedometer',
            submenu: [
            ]
        }

    ];

    if (role === '1') {
        // Contabilidad
        menu[2].submenu.push(    
            { titulo: 'Empresa', url: 'empresa' },
            { titulo: 'Sucursales', url: 'sucursales' },
            { titulo: 'Estructura Plan de Cuentas', url: 'estrucuentas' },
            { titulo: 'Plan de Cuentas', url: 'plancuentas'},
            { titulo: 'Asientos Contables', url: 'asientos'},
        );
        menu.push({
            titulo: 'Reporteria',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Reportes facturas', url: 'reporteFactura' },
            ]
        });

        // CLientes
        menu[3].submenu.push({ titulo: 'Formas de pago', url: 'formasPago' }, 
        { titulo: 'Serie de Comprobantes', url: 'serie' },
        { titulo: 'Cajas', url: 'caja' });

        // Inventario
        menu[4].submenu.push({ titulo: 'Unidades', url: 'unidades' }, { titulo: 'Impuesto', url: 'impuesto' },
        { titulo: 'Familia', url: 'familia' },{ titulo: 'Lista de Precios', url: 'tabprecio' },
        { titulo: 'Precios x Producto', url: 'lisprecios' },{ titulo: 'Precios x Cliente', url: 'precioscliente' });

        // Punto de Venta
        menu[5].submenu.push({ titulo: 'Usuarios Asignados a Caja', url: 'usucajaserie'});

        // Seguridades
        menu[6].submenu.push({ titulo: 'Cobros', url: 'cobros' });

        // Seguridades
        menu[7].submenu.push({ titulo: 'Usuarios', url: 'usuarios' });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}