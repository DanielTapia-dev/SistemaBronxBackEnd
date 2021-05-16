const getMenuFrontEnd = (role) => {
    var menu = [{
            titulo: 'Proformas',
            icono: 'icon-dash',
            submenu: [
                { titulo: 'Proformar', url: 'proformar' },
                { titulo: 'Lista de proformas', url: 'listaproformas' },
            ]
        },
        {
            titulo: 'Clientes',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Clientes', url: 'clientes' },
            ]
        }
    ];

    if (role === '1') {
<<<<<<< HEAD
        menu = [];
        menu = [{
                titulo: 'Facturas',
                icono: 'icon-cart2',
                submenu: [
                    { titulo: 'Facturar', url: 'facturar' },
                    { titulo: 'Lista de facturas', url: 'listafacturas' }
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
                    { titulo: 'Empresa', url: 'empresa' },
                    { titulo: 'Sucursales', url: 'sucursales' },
                    { titulo: 'Estructura Plan de Cuentas', url: 'estrucuentas' },
                    { titulo: 'Plan de Cuentas', url: 'contplancuentas' },
                    { titulo: 'Asientos Contables', url: 'asientos' },
                ]
            },
            {
                titulo: 'Clientes',
                icono: 'icon-speedometer',
                submenu: [
                    { titulo: 'Clientes', url: 'clientes' },
                    { titulo: 'Formas de pago', url: 'formasPago' },
                    { titulo: 'Serie de Comprobantes', url: 'serie' },
                    { titulo: 'Cajas', url: 'caja' }
                ]
            },
            {
                titulo: 'Inventario',
                icono: 'icon-speedometer',
                submenu: [
                    { titulo: 'Productos', url: 'productos' },
                    { titulo: 'Unidades', url: 'unidades' },
                    { titulo: 'Impuesto', url: 'impuesto' },
                    { titulo: 'Familia', url: 'familia' },
                    { titulo: 'Precios x Cliente', url: 'precioclientes' }
                ]
            },
            {
                titulo: 'Punto de Venta',
                icono: 'icon-speedometer',
                submenu: [
                    { titulo: 'Usuarios Asignados a Caja', url: 'usucajaserie' }
                ]
            },
            {
                titulo: 'Cobros',
                icono: 'icon-speedometer',
                submenu: [
                    { titulo: 'Cobros', url: 'cobros' }
                ]
            },
            {
                titulo: 'Seguridades',
                icono: 'icon-speedometer',
                submenu: [
                    { titulo: 'Usuarios', url: 'usuarios' }
                ]
            },
            {
                titulo: 'Reporteria',
                icono: 'icon-speedometer',
                submenu: [
                    { titulo: 'Reportes facturas', url: 'reporteFactura' },
                ]
            }
=======
        // Contabilidad
        menu[0].submenu.push({ titulo: 'Lista de facturas', url: 'listafacturas' });

        menu[2].submenu.push({ titulo: 'Empresa', url: 'empresa' }, { titulo: 'Sucursales', url: 'sucursales' }, { titulo: 'Estructura Plan de Cuentas', url: 'estrucuentas' }, { titulo: 'Plan de Cuentas', url: 'contplancuentas' }, { titulo: 'Asientos Contables', url: 'asientos' }, );
        menu.push({
            titulo: 'Reporteria',
            icono: 'icon-speedometer',
            submenu: [
                { titulo: 'Reportes facturas', url: 'reportesFacturas' },
            ]
        });

        // CLientes
        menu[3].submenu.push({ titulo: 'Formas de pago', url: 'formasPago' }, { titulo: 'Serie de Comprobantes', url: 'serie' }, { titulo: 'Cajas', url: 'caja' });

        // Inventario
        menu[4].submenu.push({ titulo: 'Unidades', url: 'unidades' }, { titulo: 'Impuesto', url: 'impuesto' }, { titulo: 'Familia', url: 'familia' }, { titulo: 'Precios x Cliente', url: 'precioclientes' });

        // Punto de Venta
        menu[5].submenu.push({ titulo: 'Usuarios Asignados a Caja', url: 'usucajaserie' });

        // Seguridades
        menu[6].submenu.push({ titulo: 'Cobros', url: 'cobros' });
>>>>>>> b90316df2f0e531e64e0f6b2e77ad9fe0c24587e

        ];
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}