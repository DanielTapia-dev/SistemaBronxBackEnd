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

        ];
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}