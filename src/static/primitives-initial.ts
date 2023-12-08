export type PrimitiveType = 'rectangle' | 'circle' | 'ellipse'

export const primitiveShapes: { [key: string]: any } = {
  rectangle: {
    type: 'standard.Rectangle',
    position: {
      x: 50,
      y: 10
    },
    size: {
      width: 100,
      height: 100
    },
    angle: 0,
    attrs: {
      body: {
        fill: '#30D0C659'
      },
      label: {
        text: 'Rectangle'
      }
    }
  },

  circle: {
    type: 'standard.Circle',
    position: {
      x: 200,
      y: 10
    },
    size: {
      width: 100,
      height: 100
    },

    attrs: {
      body: {
        fill: '#30D0C659'
      },
      label: {
        text: 'Circle'
      }
    }
  },

  ellipse: {
    type: 'standard.Ellipse',
    position: {
      x: 350,
      y: 10
    },
    size: {
      width: 150,
      height: 100
    },
    attrs: {
      body: {
        fill: '#30D0C659'
      },
      label: {
        text: 'Ellipse'
      }
    }
  }
}
