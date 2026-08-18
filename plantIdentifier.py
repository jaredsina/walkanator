import json
from io import BytesIO
import requests
from PIL import Image
import torch
import torchvision.models as models
import torchvision.transforms as transforms

device = torch.device("cpu")

# Species names: class index i -> species id -> scientific name.
# The model was trained with ImageFolder, so classes are the sorted species ids.
species_names = json.loads(requests.get(
    'https://huggingface.co/cpoisson/plantnet300k-mobilenetv3-small/resolve/main/plantnet300K_species_id_2_name.json'
).text)
species_ids = sorted(species_names.keys())
idx_to_name = {i: species_names[sid] for i, sid in enumerate(species_ids)}

# Load model
model = models.mobilenet_v3_small(weights=None, num_classes=1081)
model.load_state_dict(torch.hub.load_state_dict_from_url(
    'https://huggingface.co/cpoisson/plantnet300k-mobilenetv3-small/resolve/main/mobilenetv3_small_v2.pth',
    map_location='cpu'
))
model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


#image = transform(
#    Image.open(
#        BytesIO(
#            requests.get("https://tse2.mm.bing.net/th/id/OIP.6z23o50KM2krS7b6D9DtKAHaE8?r=0&pid=Api").content
#        )
#    ).convert("RGB")
#).unsqueeze(0).to(device)


def predict(img):
    with torch.no_grad():
        logits = model(image)
        top_k = torch.topk(logits, 5)
        probs = torch.softmax(logits, dim=1)
    return (idx_to_name[top_k.indices[0, 0].item()], probs.max().item())


#print(predict(image)[0])
