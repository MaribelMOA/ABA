import type { route as routeFn } from '../../../../../Downloads/control-vehicle/vendor/tightenco/ziggy';

declare global {
    const route: typeof routeFn;
}
