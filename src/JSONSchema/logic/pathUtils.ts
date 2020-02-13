export const concatFormPath = (path: string, newNode: string): string => {
  return path + '/' + newNode
}

const getSplit = (root: string, path: string): Array<string> => {
  const split = path.split('/')
  // Removes the root path if it is present(it should always be, but if it
  // isn't this can prevent some errors)
  if (split[0] === root) {
    split.shift()
  }
  // If there was a '/' at the end of the path before it is split(it should not
  // be there) this removes the non-existent path
  if (split[split.length - 1] === '') {
    split.pop()
  }
  return split
}

export const getSplitPath = (path: string): Array<string> => {
  return getSplit('$', path)
}

export const getSplitPointer = (path: string): Array<string> => {
  return getSplit('#', path)
}
