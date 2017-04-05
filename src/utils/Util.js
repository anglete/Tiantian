/**
 * @providesModule Util
 */
/**
 * Created by zhangyuan on 17/4/4.
 */

class Util {
  /**
   *
   * @param objs
   */
  mix(...objs) {
    const object = {};
    for (const obj of objs) {
      Object.keys(obj).map((key) => {
        object[key] = obj[key];
      });
    }
    return object;
  }
}

export default new Util();
