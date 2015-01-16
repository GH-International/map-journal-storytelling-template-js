if (document.location.protocol == "file:") {
    $(document).ready(function() {
        $("#fatalError .error-title").html("Application loading failed");
        $("#fatalError .error-msg").html("The application has to be accessed through a web server. Consult user guide for detail.");
        $("#fatalError").show();
    });
} else {
    var i18n = null;
    define.amd.jQuery = true;

    require([
        "dojo/i18n!./resources/tpl/viewer/nls/template.js?v=" + app.version,
        "esri/urlUtils",
        "dojo/dom",
        "dojo/ready"
    ], function(
        i18nViewer,
        urlUtils,
        dom
    ) {
        i18n = i18nViewer;

        console.log("add proxy..");
        //all proxy rules to the proxyUrl defined in this object.
        
        //here's the old 'hard-coded' proxy rules
        /*
	    urlUtils.addProxyRule({
	      urlPrefix: "www.arcgis.com/sharing/content/items",  
	      proxyUrl: "proxy/proxy.php"
	    });
	    urlUtils.addProxyRule({
	      urlPrefix: "services1.arcgis.com",  
	      proxyUrl: "proxy/proxy.php"
	    });
	            */
        //console.log('proxy= ' + app.cfg.httpProxy.alwaysUseProxy);            

        /**/
        // Section below contains the proxy rules from the config file (config.js)
        esriConfig.defaults.io.alwaysUseProxy = app.cfg.httpProxy && app.cfg.httpProxy.useProxy && app.cfg.httpProxy.alwaysUseProxy;
        esriConfig.defaults.io.proxyUrl = "";
        esriConfig.defaults.io.proxyRules = [];

        if (app.cfg.httpProxy && app.cfg.httpProxy.useProxy && app.cfg.httpProxy.url) {
            esriConfig.defaults.io.proxyUrl = app.cfg.httpProxy.url;
        }

        if (app.cfg.httpProxy && app.cfg.httpProxy.useProxy && app.cfg.httpProxy.rules) {
            //console.log('must be true..');
            array.forEach(app.cfg.httpProxy.rules, function(rule) {
                esriUrlUtils.addProxyRule(rule);
            });
        };

        require([
            "storymaps/common/Core",
            "storymaps/tpl/core/MainView",
            "templateConfig/commonConfig.js?v=" + app.version
        ], function(
            Core,
            MainView
        ) {
            if (app.isInBuilder) {
                require([
                    "storymaps/common/builder/Builder",
                    "storymaps/tpl/builder/BuilderView",
                    "dojo/i18n!./resources/tpl/builder/nls/template.js?v=" + app.version,
                    "dojo/i18n!commonResources/nls/core.js?v=" + app.version,
                    "dojo/i18n!commonResources/nls/media.js?v=" + app.version,
                    "dojo/i18n!commonResources/nls/webmap.js?v=" + app.version,
                    "dojo/i18n!commonResources/nls/mapcontrols.js?v=" + app.version,
                    "dojo/_base/lang"
                ], function(
                    Builder,
                    BuilderView,
                    i18nBuilder,
                    i18nCommonBuilder,
                    i18nCommonMedia,
                    i18nCommonWebmap,
                    i18nCommonMapControls,
                    lang
                ) {
                    lang.mixin(i18n, i18nBuilder);
                    lang.mixin(i18n, i18nCommonBuilder);
                    lang.mixin(i18n, i18nCommonMedia);
                    lang.mixin(i18n, i18nCommonWebmap);
                    lang.mixin(i18n, i18nCommonMapControls);

                    var builderView = new BuilderView(Core),
                        mainView = new MainView(builderView);

                    Core.init(mainView, Builder);
                    Builder.init(Core, builderView);
                });
            } else {
                Core.init(new MainView());
            }
        });
    });
}
