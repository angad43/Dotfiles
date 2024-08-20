import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Indicator from './indicator.js';
import IndicatorValues from './indicatorvalues.js';

export default (monitor = 0) => Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    className: 'indicator',
    layer: 'overlay',
    // exclusivity: 'ignore',
    visible: true,
    anchor: ['top'],
    child: Widget.EventBox({
        onHover: () => { //make the widget hide when hovering
            Indicator.popup(-1);
        },
        child: Widget.Box({
            vertical: true,
            className: 'osd-window',
            css: 'min-height: 2px;',
            children: [
                IndicatorValues(monitor),
            ]
        })
    }),
});
