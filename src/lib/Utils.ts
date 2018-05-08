import deepmerge from 'deepmerge';

export function merge<TItem>(items: Array<Partial<TItem>>, options: deepmerge.Options = {}) {
    return deepmerge.all(items, {
        ...{ arrayMerge: (destination, source) => source.slice() },
        ...options
    });
}
