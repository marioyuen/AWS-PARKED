import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np
import boto3
s3 = boto3.resource('s3', region_name='us-east-1')
bucket = s3.Bucket('fit5225bucket')
object = bucket.Object('car2.jpg')
object.download_file('car2.jpg')
img=mpimg.imread('car2.jpg')
imgplot = plt.imshow(img)
plt.show(imgplot)