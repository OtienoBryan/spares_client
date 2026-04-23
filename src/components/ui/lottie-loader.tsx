import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LottieLoaderProps {
  animationData?: any;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

// Component glass pouring animation
const ComponentGlassAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 120,
  "w": 200,
  "h": 200,
  "nm": "Component Glass Pouring",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Component Glass",
      "sr": 1,
      "ks": {
        "p": {
          "a": 0,
          "k": [100, 100, 0],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 0,
          "k": [100, 100, 100],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "rc",
              "s": {
                "a": 0,
                "k": [40, 60],
                "ix": 2
              },
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 0,
                "k": [0.2, 0.2, 0.2, 1],
                "ix": 3
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 4
              },
              "w": {
                "a": 0,
                "k": [2],
                "ix": 5
              },
              "lc": 2,
              "lj": 2,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "Glass",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    },
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "Component Pour",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            {
              "i": {
                "x": [0.833],
                "y": [0.833]
              },
              "o": {
                "x": [0.167],
                "y": [0.167]
              },
              "t": 0,
              "s": [0]
            },
            {
              "i": {
                "x": [0.833],
                "y": [0.833]
              },
              "o": {
                "x": [0.167],
                "y": [0.167]
              },
              "t": 30,
              "s": [100]
            },
            {
              "t": 90,
              "s": [100]
            },
            {
              "t": 120,
              "s": [0]
            }
          ],
          "ix": 11
        },
        "p": {
          "a": 0,
          "k": [100, 100, 0],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 0,
          "k": [100, 100, 100],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "rc",
              "s": {
                "a": 0,
                "k": [30, 40],
                "ix": 2
              },
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false
            },
            {
              "ty": "fl",
              "c": {
                "a": 0,
                "k": [0.8, 0.2, 0.4, 1],
                "ix": 4
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 5
              },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "Component",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

// Elegant wave animation
const waveAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 90,
  "w": 200,
  "h": 200,
  "nm": "Elegant Wave",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Wave 1",
      "sr": 1,
      "ks": {
        "p": {
          "a": 1,
          "k": [
            {
              "i": {
                "x": 0.833,
                "y": 0.833
              },
              "o": {
                "x": 0.167,
                "y": 0.167
              },
              "t": 0,
              "s": [100, 100, 0]
            },
            {
              "i": {
                "x": 0.833,
                "y": 0.833
              },
              "o": {
                "x": 0.167,
                "y": 0.167
              },
              "t": 45,
              "s": [100, 100, 0]
            },
            {
              "t": 90,
              "s": [100, 100, 0]
            }
          ],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 0,
          "k": [100, 100, 100],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  "v": [[-30, 0], [-20, -10], [-10, 0], [0, -10], [10, 0], [20, -10], [30, 0], [0, 0]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 0,
                "k": [0.8, 0.2, 0.4, 1],
                "ix": 3
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 4
              },
              "w": {
                "a": 0,
                "k": [3],
                "ix": 5
              },
              "lc": 2,
              "lj": 2,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "Wave",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 90,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

// Network error animation
const networkErrorAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 120,
  "w": 200,
  "h": 200,
  "nm": "Network Error",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "WiFi Icon",
      "sr": 1,
      "ks": {
        "p": {
          "a": 0,
          "k": [100, 100, 0],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 0,
          "k": [100, 100, 100],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0], [0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0], [0, 0], [0, 0]],
                  "v": [[-20, 0], [0, -20], [20, 0], [0, 20]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 0,
                "k": [0.8, 0.2, 0.4, 1],
                "ix": 3
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 4
              },
              "w": {
                "a": 0,
                "k": [3],
                "ix": 5
              },
              "lc": 2,
              "lj": 2,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "WiFi",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    },
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "Error X",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            {
              "i": {
                "x": [0.833],
                "y": [0.833]
              },
              "o": {
                "x": [0.167],
                "y": [0.167]
              },
              "t": 30,
              "s": [0]
            },
            {
              "i": {
                "x": [0.833],
                "y": [0.833]
              },
              "o": {
                "x": [0.167],
                "y": [0.167]
              },
              "t": 60,
              "s": [100]
            },
            {
              "t": 90,
              "s": [100]
            },
            {
              "t": 120,
              "s": [0]
            }
          ],
          "ix": 11
        },
        "p": {
          "a": 0,
          "k": [100, 100, 0],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 0,
          "k": [100, 100, 100],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0]],
                  "v": [[-15, -15], [15, 15]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 0,
                "k": [0.9, 0.1, 0.1, 1],
                "ix": 3
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 4
              },
              "w": {
                "a": 0,
                "k": [4],
                "ix": 5
              },
              "lc": 2,
              "lj": 2,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "X Line 1",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        },
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0]],
                  "v": [[15, -15], [-15, 15]],
                  "c": false
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 0,
                "k": [0.9, 0.1, 0.1, 1],
                "ix": 3
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 4
              },
              "w": {
                "a": 0,
                "k": [4],
                "ix": 5
              },
              "lc": 2,
              "lj": 2,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "X Line 2",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

// Modern geometric spinner
const geometricSpinner = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Geometric Spinner",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Square",
      "sr": 1,
      "ks": {
        "r": {
          "a": 1,
          "k": [
            {
              "i": {
                "x": [0.833],
                "y": [0.833]
              },
              "o": {
                "x": [0.167],
                "y": [0.167]
              },
              "t": 0,
              "s": [0]
            },
            {
              "t": 60,
              "s": [360]
            }
          ],
          "ix": 10
        },
        "p": {
          "a": 0,
          "k": [100, 100, 0],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [0, 0, 0],
          "ix": 1
        },
        "s": {
          "a": 1,
          "k": [
            {
              "i": {
                "x": [0.833, 0.833, 0.833],
                "y": [0.833, 0.833, 0.833]
              },
              "o": {
                "x": [0.167, 0.167, 0.167],
                "y": [0.167, 0.167, 0.167]
              },
              "t": 0,
              "s": [100, 100, 100]
            },
            {
              "i": {
                "x": [0.833, 0.833, 0.833],
                "y": [0.833, 0.833, 0.833]
              },
              "o": {
                "x": [0.167, 0.167, 0.167],
                "y": [0.167, 0.167, 0.167]
              },
              "t": 30,
              "s": [80, 80, 80]
            },
            {
              "t": 60,
              "s": [100, 100, 100]
            }
          ],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "rc",
              "s": {
                "a": 0,
                "k": [40, 40],
                "ix": 2
              },
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false
            },
            {
              "ty": "st",
              "c": {
                "a": 0,
                "k": [0.8, 0.2, 0.4, 1],
                "ix": 3
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 4
              },
              "w": {
                "a": 0,
                "k": [4],
                "ix": 5
              },
              "lc": 2,
              "lj": 2,
              "ml": 4,
              "bm": 0,
              "nm": "Stroke 1",
              "mn": "ADBE Vector Graphic - Stroke",
              "hd": false
            },
            {
              "ty": "tr",
              "p": {
                "a": 0,
                "k": [0, 0],
                "ix": 2
              },
              "a": {
                "a": 0,
                "k": [0, 0],
                "ix": 1
              },
              "s": {
                "a": 0,
                "k": [100, 100],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": [0],
                "ix": 6
              },
              "o": {
                "a": 0,
                "k": [100],
                "ix": 7
              },
              "sk": {
                "a": 0,
                "k": [0],
                "ix": 4
              },
              "sa": {
                "a": 0,
                "k": [0],
                "ix": 5
              },
              "nm": "Transform"
            }
          ],
          "nm": "Square",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 60,
      "st": 0,
      "bm": 0
    }
  ],
  "markers": []
};

export const LottieLoader = ({ 
  animationData, 
  src, 
  size = 'md', 
  className = '', 
  loop = true, 
  autoplay = true 
}: LottieLoaderProps) => {
  const [animation, setAnimation] = useState(animationData || geometricSpinner);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (src) {
      setLoading(true);
      fetch(src)
        .then(response => response.json())
        .then(data => {
          setAnimation(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load Lottie animation:', error);
          setLoading(false);
        });
    }
  }, [src]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="animate-spin rounded-full h-full w-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <Lottie
        animationData={animation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

// Industrial Rotating Gear Animation
const gearAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 100,
  "h": 100,
  "nm": "Rotating Gear",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Gear",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { "a": 1, "k": [{ "t": 0, "s": [0] }, { "t": 60, "s": [360] }] },
        "p": { "a": 0, "k": [50, 50, 0] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "st",
              "c": { "a": 0, "k": [0.8, 0.1, 0.1, 1] },
              "o": { "a": 0, "k": 100 },
              "w": { "a": 0, "k": 4 }
            },
            {
              "ty": "sh",
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0,0],[0,0],[0,0],[0,0]],
                  "o": [[0,0],[0,0],[0,0],[0,0]],
                  "v": [[-20,-20],[20,-20],[20,20],[-20,20]],
                  "c": true
                }
              }
            }
          ]
        }
      ]
    }
  ]
};

// Spares-themed loading animations
export const LoadingSpares = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => (
  <LottieLoader size={size} className={className} animationData={gearAnimation} />
);

export const LoadingWave = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => (
  <LottieLoader size={size} className={className} animationData={gearAnimation} />
);

export const LoadingGear = LoadingSpares;

export const LoadingSpinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => (
  <LottieLoader size={size} className={className} animationData={gearAnimation} />
);

export const LoadingNetworkError = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => (
  <LottieLoader size={size} className={className} animationData={networkErrorAnimation} />
);

// Keep the old names for backward compatibility
export const LoadingDots = LoadingWave;
export const LoadingPulse = LoadingSpares; export const LoadingComponent = LoadingSpares;
